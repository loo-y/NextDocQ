// ai answer question as an Interviewer
import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import MemoryChat from '../azure/memoryChat'
import { RedisGet } from '../redis/[action]'

export default async function Interviewer(req: NextApiRequest, res: NextApiResponse<any>) {
    let question, memoryChatKey
    let questionTimestamp = new Date().getTime()
    if (req.method === 'POST') {
        const body = req?.body || {}
        question = body.question || question
        memoryChatKey = body.memoryChatKey || memoryChatKey
        questionTimestamp = body.timestamp || questionTimestamp
    } else if (req.method === 'GET') {
        const query = req?.query || {}
        question = query.q || question
        memoryChatKey = query.m || memoryChatKey
        questionTimestamp = query.t && Number(query.t) ? Number(query.t) : questionTimestamp
    }

    // get systemChatText from redis
    const systemChatText = await getSystemTextFromRedis(memoryChatKey)

    if (systemChatText) {
        const reuslt = await MemoryChat({
            systemChatText,
            memoryChatKey,
            question,
            questionTimestamp,
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
