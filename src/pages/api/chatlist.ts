import type { NextApiRequest, NextApiResponse } from 'next'
import { RedisGet } from './redis/[action]'
import _ from 'lodash'

const ChatList = async (req: NextApiRequest, res: NextApiResponse) => {
    const { memoryChatKey } = req.body || {}
    const redisChatMessages = await getChatList(memoryChatKey)

    return res.status(200).json({ chatList: redisChatMessages })
}

export default ChatList

const getChatList = async (memoryChatKey?: string) => {
    if (!memoryChatKey) return []
    const redisChatMessages = await RedisGet(memoryChatKey)
    return _.isEmpty(redisChatMessages) ? [] : redisChatMessages
}
