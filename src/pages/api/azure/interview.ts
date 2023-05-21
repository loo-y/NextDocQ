import type { NextApiRequest, NextApiResponse } from 'next'
import { modelGPT35Turbo, modelChatGPT35Turbo } from './common'
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema'

export default async function AzureInterview(req: NextApiRequest, res: NextApiResponse<any>) {
    let careerType, question
    if (req.method === 'POST') {
        const body = req?.body || {}
        careerType = body.careerType || careerType
        question = body.question || question
    }
    if (req.method === 'GET') {
        console.log(`req.body`, req.body)
        console.log(`req.query`, req.query)
        const query = req?.query || {}
        careerType = query.c || careerType
        question = query.q || question
    }

    if (careerType && question) {
        try {
            careerType = decodeURIComponent(careerType)
            question = decodeURIComponent(question)
            const systemChatMessage = new SystemChatMessage(
                `you are an interviewee, the job is ${careerType}. I am interviewer. now you start answer my question.`
            )
            const humanChatMessage = new HumanChatMessage(`${question}`)
            const modelResult = await modelChatGPT35Turbo.call([systemChatMessage, humanChatMessage], {
                timeout: 10000,
            })
            console.log(`AzureInterview`, { modelResult })
            return res.status(200).json({ modelResult })
        } catch (e) {
            console.log(`AzureInterview`, { e })
            return res.status(500).json({ e })
        }
    }
    return res.status(200).json({ body: req.body, query: req.query })
}
