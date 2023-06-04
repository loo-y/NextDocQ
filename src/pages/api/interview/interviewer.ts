// ai answer question as an Interviewer
import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import MemoryChat from '../azure/memoryChat'
import { RedisGet } from '../redis/[action]'

export default async function Interviewer(req: NextApiRequest, res: NextApiResponse<any>) {
    let humanSay,
        memoryChatKey,
        noMemory = false,
        aiResponse
    let questionTimestamp = new Date().getTime()
    if (req.method === 'POST') {
        const body = req?.body || {}
        humanSay = body.humanSay || humanSay
        memoryChatKey = body.memoryChatKey || memoryChatKey
        questionTimestamp = body.timestamp || questionTimestamp
        noMemory = body.noMemory || noMemory
        aiResponse = body.aiResponse || aiResponse
    } else if (req.method === 'GET') {
        const query = req?.query || {}
        humanSay = query.human || humanSay
        memoryChatKey = query.m || memoryChatKey
        questionTimestamp = query.t && Number(query.t) ? Number(query.t) : questionTimestamp
        noMemory = query.n == '1' || noMemory
        aiResponse = query.ai || aiResponse
    }

    // get systemChatText from redis
    const systemChatText = await getSystemTextFromRedis(memoryChatKey)

    if (systemChatText) {
        const reuslt = await MemoryChat({
            isAiAsk: true, // ai ask and human answer
            systemChatText,
            memoryChatKey,
            humanSay: humanSay,
            aiResponse,
            chatTimestamp: questionTimestamp,
            noMemory,
        })
        return res.status(200).json(reuslt)
    }

    return res.status(200).json({ answer: ``, memoryChatKey })
}

const getSystemTextFromRedis = async (memoryChatKey: string) => {
    if (!memoryChatKey) return null

    const redisChatMessages = await RedisGet(memoryChatKey)
    const systemChatText = _.find(redisChatMessages || [], chatItem => {
        return chatItem?.type === 'system'
    })?.system

    return systemChatText
}
