import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import { modelGPT35Turbo, modelChatGPT35Turbo } from './common'
import { HumanChatMessage, SystemChatMessage, AIChatMessage, BaseChatMessage, MessageType } from 'langchain/schema'
import { BufferMemory, BaseMemory } from 'langchain/memory'
import { RedisChatMessageHistory } from 'langchain/stores/message/redis'
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
} from 'langchain/prompts'
import { ConversationChain } from 'langchain/chains'
import { RedisGet, RedisSet } from '../redis/[action]'
import { checkCareer } from '../careerlist'

export default async function AzureInterview(req: NextApiRequest, res: NextApiResponse<any>) {
    let careerType, question, memoryChatKey
    const questionTimestamp = new Date().getTime()
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

    careerType = careerType && decodeURIComponent(careerType)
    question = question && decodeURIComponent(question)
    const careerText = await checkCareer(careerType)

    // if (careerType && question) {
    if (careerText && question) {
        try {
            // careerType = decodeURIComponent(careerType)
            // question = decodeURIComponent(question)
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
                `you are an interviewee, the job is ${careerText}. I am interviewer. now you start answer my question.`
            )
            const memoryHistory = 'history'
            const humanChatMessage = HumanMessagePromptTemplate.fromTemplate('{input}')
            const chatPrompt = ChatPromptTemplate.fromPromptMessages([
                systemChatMessage,
                new MessagesPlaceholder(memoryHistory),
                humanChatMessage,
            ])

            let redisChatMessages: any = []
            let memory = new BufferMemory({ returnMessages: true, memoryKey: memoryHistory })
            // try to restore memory chatHistory from redis
            if (memoryChatKey) {
                const infoFromRedis = await updateChatHistoryFromRedis(memoryChatKey, memory)
                memory = infoFromRedis.memory
                redisChatMessages = infoFromRedis.redisChatMessages || redisChatMessages
            }

            let chain = new ConversationChain({
                memory: memory,
                prompt: chatPrompt,
                llm: modelChatGPT35Turbo,
            })

            const response = await chain.call({
                input: `${question}`,
            })

            const aiAnswer = response?.response
            if (aiAnswer) {
                // const memoryMessags = await memory.chatHistory?.getMessages()
                // const memoryMessagsWithInfo: {type: MessageType, chatInfo: BaseChatMessage}[] = _.isEmpty(memoryMessags) ? [] : _.map(memoryMessags, chatMessage => {
                //     return {
                //         // MessageType: "human" | "ai" | "generic" | "system"
                //         type: chatMessage?._getType() || undefined,
                //         chatInfo: chatMessage,
                //     }
                // })

                const memoryChatMessages: { ai: string; human: string; timestamp: number }[] = _.concat(
                    redisChatMessages,
                    [
                        {
                            ai: aiAnswer,
                            human: question,
                            timestamp: questionTimestamp,
                        },
                    ]
                )
                await storeChatHistoryToRedis(memoryChatKey, memoryChatMessages)

                return res.status(200).json({ answer: aiAnswer, memoryChatKey, memoryMessags: memoryChatMessages })
            }
        } catch (e) {
            console.log(`AzureInterview`, { e })
            return res.status(200).json({ error: e, memoryChatKey })
        }
    }
    return res.status(200).json({ answer: ``, memoryChatKey })
}

const storeChatHistoryToRedis = async (
    memoryChatKey: string,
    chatMessages: { ai: string; human: string; timestamp: number }[]
) => {
    if (!memoryChatKey || _.isEmpty(chatMessages)) return

    const redisChatMessages = _.map(chatMessages, chatMessage => {
        return {
            ...chatMessage,
        }
    })

    await RedisSet(memoryChatKey, redisChatMessages)
}

const updateChatHistoryFromRedis = async (memoryChatKey: string, memory: BufferMemory) => {
    if (!memoryChatKey) return { memory }

    const redisChatMessages = await RedisGet(memoryChatKey)
    if (_.isEmpty(redisChatMessages)) return { memory }

    _.map(redisChatMessages, redisChatMessage => {
        const { ai, human } = redisChatMessage || {}
        if (ai && human) {
            memory.chatHistory.addUserMessage(human)
            memory.chatHistory.addAIChatMessage(ai)
        }
    })

    return { memory, redisChatMessages }
}
