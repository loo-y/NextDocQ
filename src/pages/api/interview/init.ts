// Initiate the interview system message
import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import { RedisGet, RedisSet } from '../redis/[action]'
export default async function Init(req: NextApiRequest, res: NextApiResponse<any>) {
    let systemText,
        memoryChatKey = new Date().getTime().toString()
    if (req.method === 'POST') {
        const body = req?.body || {}
        systemText = body.systemText || systemText
    } else if (req.method === 'GET') {
        const query = req?.query || {}
        systemText = query.systemtext || systemText
    }

    if (systemText) {
        try {
            const redisChatMessages = {
                type: 'system',
                system: systemText,
            }
            await RedisSet(memoryChatKey, redisChatMessages)
            return res.status(200).json({ systemText, isSuccess: true, memoryChatKey })
        } catch (e) {
            console.log(`init`, e)
            return res.status(200).json({ systemText, isSuccess: false, error: e, memoryChatKey })
        }
    }

    return res.status(200).json({ systemText, isSuccess: false, memoryChatKey })
}
