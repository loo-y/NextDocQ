import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'langchain/llms/openai' // azure openai
import * as dotenv from 'dotenv'
dotenv.config()

const { azureOpenAIApiKey, azureOpenAIApiInstanceName, azureOpenAIApiDeploymentName, azureOpenAIApiVersion } =
    process.env || {}

const model = new OpenAI({
    temperature: 0.9,
    azureOpenAIApiKey,
    azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName,
    azureOpenAIApiVersion,
})

export default async function AzureCall(req: NextApiRequest, res: NextApiResponse<any>) {
    if (req.method === 'POST') {
        console.log(req.body)
        const modelResult = await model.call('What would be a good company name a company that makes colorful socks?')
        console.log({ modelResult })
        return res.status(200).json({ modelResult })
    }
    if (req.method === 'GET') {
        console.log(req.body)
        return res.status(404)
    }
}
