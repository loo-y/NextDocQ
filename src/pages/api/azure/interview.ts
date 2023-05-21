import type { NextApiRequest, NextApiResponse } from 'next'
import { modelGPT35Turbo, modelChatGPT35Turbo } from './common'
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema'

export default async function AzureInterview(req: NextApiRequest, res: NextApiResponse<any>) {
    const systemChatMessage = new SystemChatMessage(
        'you are an interviewee, the job is web front-end developer. I am interviewer. now you start answer my question.'
    )
    const humanChatMessage = new HumanChatMessage(
        'please explain what is the difference between var, let and const in javascript?'
    )

    if (req.method === 'GET' || req.method === 'POST') {
        const modelResult = await modelChatGPT35Turbo.call([systemChatMessage, humanChatMessage], { timeout: 10000 })
        console.log({ modelResult })
        console.log(`AzureInterview`, { modelResult })
        return res.status(200).json({ modelResult })
    }
}
