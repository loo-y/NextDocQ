// azure chat and store/get list from redis, split logic from src/pages/api/azure/interview.ts
import _ from 'lodash'
import { modelChatGPT35Turbo } from './common'
import { BufferMemory } from 'langchain/memory'
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
    MessagesPlaceholder,
} from 'langchain/prompts'
import { ConversationChain } from 'langchain/chains'
import { RedisGet, RedisSet } from '../redis/[action]'
export default async function MemoryChat(props: {
    isAiAsk?: boolean
    systemChatText: string
    memoryChatKey: string
    aiResponse?: string
    humanSay: string
    noMemory?: boolean
    chatTimestamp: string | number
}) {
    const { isAiAsk, systemChatText, memoryChatKey, humanSay, aiResponse, noMemory, chatTimestamp } = props || {}

    try {
        const systemChatMessage = SystemMessagePromptTemplate.fromTemplate(systemChatText)
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
            const infoFromRedis = await updateChatHistoryFromRedis(memoryChatKey, memory, isAiAsk)
            memory = infoFromRedis.memory
            redisChatMessages = infoFromRedis.redisChatMessages || redisChatMessages
        }

        let chain = new ConversationChain({
            memory: memory,
            prompt: chatPrompt,
            llm: modelChatGPT35Turbo,
        })

        const response = await chain.call({
            input: `${humanSay}`,
        })

        const latestAiResponse = response?.response
        if (latestAiResponse) {
            let memoryChatMessages: { ai: string; human: string; timestamp: number }[]
            if (noMemory) {
                // not store to redis
                memoryChatMessages = redisChatMessages
            } else if (aiResponse) {
                // store ai response from request in redis
                memoryChatMessages = _.concat(redisChatMessages, [
                    {
                        ai: aiResponse,
                        human: humanSay,
                        timestamp: chatTimestamp,
                    },
                ])
            } else {
                memoryChatMessages = _.concat(redisChatMessages, [
                    {
                        ai: latestAiResponse,
                        human: humanSay,
                        timestamp: chatTimestamp,
                    },
                ])
            }

            await storeChatHistoryToRedis(memoryChatKey, memoryChatMessages)

            return { answer: latestAiResponse, memoryChatKey, memoryMessags: memoryChatMessages }
        }
    } catch (e) {
        console.log(`AzureInterview`, { e })
        return { error: e, memoryChatKey }
    }

    return { answer: ``, memoryChatKey }
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

const updateChatHistoryFromRedis = async (memoryChatKey: string, memory: BufferMemory, isAiAsk?: boolean) => {
    if (!memoryChatKey) return { memory }

    let redisChatMessages = await RedisGet(memoryChatKey)
    // redisChatMessages = _.filter(redisChatMessages || [], chatItem => {
    //     return !chatItem?.type || chatItem.type !== 'system'
    // })
    if (_.isEmpty(redisChatMessages)) return { memory }

    _.map(redisChatMessages, redisChatMessage => {
        const { ai, human, type } = redisChatMessage || {}
        if (ai && human && type !== 'system') {
            if (isAiAsk) {
                memory.chatHistory.addAIChatMessage(ai)
                memory.chatHistory.addUserMessage(human)
            } else {
                memory.chatHistory.addUserMessage(human)
                memory.chatHistory.addAIChatMessage(ai)
            }
        }
    })

    return { memory, redisChatMessages }
}
