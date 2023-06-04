// ai answer question as an interviewee
import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import { checkCareer } from '../interview/careerlist'
import MemoryChat from '../azure/memoryChat'

export default async function Interviewee(req: NextApiRequest, res: NextApiResponse<any>) {
    let careerType, question, memoryChatKey
    let questionTimestamp = new Date().getTime()
    if (req.method === 'POST') {
        const body = req?.body || {}
        careerType = body.careerType || careerType
        question = body.question || question
        memoryChatKey = body.memoryChatKey || memoryChatKey
        questionTimestamp = body.timestamp || questionTimestamp
    } else if (req.method === 'GET') {
        const query = req?.query || {}
        careerType = query.c || careerType
        question = query.q || question
        memoryChatKey = query.m || memoryChatKey
        questionTimestamp = query.t && Number(query.t) ? Number(query.t) : questionTimestamp
    }

    careerType = careerType && decodeURIComponent(careerType)
    question = question && decodeURIComponent(question)
    const careerText = await checkCareer(careerType)

    // only the careerType is validated and question are not empty, then start the interview
    if (careerText && question) {
        const systemChatText = `you are an interviewee, the job is ${careerText}. I am interviewer. now you start answer my question.`
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
