// Initiate the interview system message
import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import { RedisGet, RedisSet } from '../redis/[action]'
export default async function Init(req: NextApiRequest, res: NextApiResponse<any>) {
    let systemText,
        JDContent,
        resumeContent,
        memoryChatKey = new Date().getTime().toString()
    if (req.method === 'POST') {
        const body = req?.body || {}
        JDContent = body.JDContent || JDContent
        resumeContent = body.resumeContent || resumeContent
        systemText = body.systemText || systemText
    } else if (req.method === 'GET') {
        const query = req?.query || {}
        JDContent = query.jd || JDContent
        resumeContent = query.resume || resumeContent
        systemText = query.systemtext || systemText
    }

    if (JDContent && resumeContent) {
        systemText = `You are the interviewer, starting to interview the candidate.
        Here is the job description: 
        ${JDContent}

        The candidate's resume: 
        ${resumeContent}

        As the interviewer, go from simple to complex, ask one question at a time, and then make judgments based on the candidate's answer and give the next question accordingly. When the candidate answers that the interview is over, start summing up and evaluating the candidate's entire interview.
        Now the interview starts, please ask the first question.`
    }

    if (systemText) {
        try {
            const redisChatMessages = [
                {
                    type: 'system',
                    system: systemText,
                },
            ]
            await RedisSet(memoryChatKey, redisChatMessages)
            return res.status(200).json({ systemText, isSuccess: true, memoryChatKey })
        } catch (e) {
            console.log(`init`, e)
            return res.status(200).json({ systemText, isSuccess: false, error: e, memoryChatKey })
        }
    }

    return res.status(200).json({ systemText, isSuccess: false, memoryChatKey })
}
