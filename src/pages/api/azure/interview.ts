import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import { modelGPT35Turbo, modelChatGPT35Turbo } from './common'
import { HumanChatMessage, SystemChatMessage, AIChatMessage, BaseChatMessage, MessageType } from 'langchain/schema'
import { BaseMemory } from 'langchain/memory'
import { RedisChatMessageHistory } from 'langchain/stores/message/redis'
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
} from 'langchain/prompts'
import { BufferMemory } from 'langchain/memory'
import { ConversationChain } from 'langchain/chains'
import { RedisGet, RedisSet } from '../redis/[action]'

export default async function AzureInterview(req: NextApiRequest, res: NextApiResponse<any>) {
    let careerType, question, memoryChatKey
    if (req.method === 'POST') {
        const body = req?.body || {}
        careerType = body.careerType || careerType
        question = body.question || question
        memoryChatKey = body.memoryChatKey || memoryChatKey
    }
    if (req.method === 'GET') {
        console.log(`req.body`, req.body)
        console.log(`req.query`, req.query)
        const query = req?.query || {}
        careerType = query.c || careerType
        question = query.q || question
        memoryChatKey = query.m || memoryChatKey
    }

    if (careerType && question) {
        try {
            careerType = decodeURIComponent(careerType)
            question = decodeURIComponent(question)
            // const systemChatMessage = new SystemChatMessage(
            //     `you are an interviewee, the job is ${careerType}. I am interviewer. now you start answer my question.`
            // )
            // const humanChatMessage = new HumanChatMessage(`${question}`)
            // const modelResult = await modelChatGPT35Turbo.call([systemChatMessage, humanChatMessage], {
            //     timeout: 10000,
            // })
            // console.log(`AzureInterview`, { modelResult })
            // return res.status(200).json({ modelResult })

            const systemChatMessage = SystemMessagePromptTemplate.fromTemplate(
                `you are an interviewee, the job is ${careerType}. I am interviewer. now you start answer my question.`
            )
            const memoryHistory = 'history'
            const humanChatMessage = HumanMessagePromptTemplate.fromTemplate('{input}')
            const chatPrompt = ChatPromptTemplate.fromPromptMessages([
                systemChatMessage,
                new MessagesPlaceholder(memoryHistory),
                humanChatMessage,
            ])

            let memory = new BufferMemory({ returnMessages: true, memoryKey: memoryHistory })
            // try to restore memory chatHistory from redis
            if (memoryChatKey) {
                memory = await updateChatHistoryFromRedis(memoryChatKey, memory)
            }

            let chain = new ConversationChain({
                memory: memory,
                prompt: chatPrompt,
                llm: modelChatGPT35Turbo,
            })

            const response = await chain.call({
                input: `${question}`,
            })

            const memoryMessags = await chain.memory.chatHistory.getMessages()
            await storeChatHistoryToRedis(memoryChatKey, memoryMessags)

            return res.status(200).json({ response, memoryMessags })
        } catch (e) {
            console.log(`AzureInterview`, { e })
            return res.status(500).json({ e })
        }
    }
    return res.status(200).json({ body: req.body, query: req.query })
}

const storeChatHistoryToRedis = async (memoryChatKey: string, chatMessages: BaseChatMessage[]) => {
    if (!memoryChatKey || _.isEmpty(chatMessages)) return

    const redisChatMessages = _.map(chatMessages, chatMessage => {
        return {
            type: chatMessage?._getType() || undefined, // MessageType: "human" | "ai" | "generic" | "system"
            chatInfo: chatMessage,
        }
    })

    await RedisSet(memoryChatKey, redisChatMessages)
}

const updateChatHistoryFromRedis = async (memoryChatKey: string, memory: BufferMemory) => {
    if (!memoryChatKey) return memory

    const redisChatMessages = await RedisGet(memoryChatKey)
    if (_.isEmpty(redisChatMessages)) return memory

    _.map(redisChatMessages, redisChatMessage => {
        const { type, chatInfo } = redisChatMessage || {}
        const { text } = chatInfo || {}
        if (text) {
            if (type === 'human') {
                // return new HumanChatMessage(chatInfo?.text)
                memory.chatHistory.addUserMessage(text)
            }
            if (type === 'ai') {
                // return new AIChatMessage(chatInfo?.text)
                memory.chatHistory.addAIChatMessage(text)
            }
            // if(type === 'system'){
            //     return new SystemChatMessage(chatInfo?.text)
            // }
            // return new HumanChatMessage(chatInfo?.text)
        }
    })

    return memory
}
