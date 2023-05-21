import type { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from '@upstash/redis'
import * as dotenv from 'dotenv'
dotenv.config()
enum REDIS_ACTIONS {
    GET = `get`,
    SET = `set`,
}

const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env || {}

const upstashRedis = new Redis({
    // @ts-ignore
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
})

const ActionHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    let { action, key, value } = req.query || {}
    if (!action) return res.status(404)
    action = action.toString().toLowerCase()
    key = key?.toString()
    value = value?.toString()

    if (REDIS_ACTIONS.GET === action) {
        const remoteValue = await RedisGet(key)
        return res.status(200).json({ action, key, value: remoteValue })
    }

    if (REDIS_ACTIONS.SET === action) {
        const newValue = await RedisSet(key, value)
        return res.status(200).json({ action, key, value: newValue })
    }
    return res.status(200).json({ error: `action not found` })
}

export default ActionHandler
export const RedisGet = async (key: string | undefined) => {
    if (!key) return null
    const data = await upstashRedis.get(key)
    return data
}
export const RedisSet = async (key: string | undefined, value: string | undefined) => {
    if (!key) return null
    if (!value) return await RedisGet(key)
    const data = await upstashRedis.set(key, value)
    if (data === `OK`) return value
    return null
}
