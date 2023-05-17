import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'langchain/llms/openai' // azure openai
import * as dotenv from 'dotenv'
dotenv.config()

const { azureOpenAIApiKey, azureOpenAIApiInstanceName, azureOpenAIApiDeploymentName, azureOpenAIApiVersion } =
    process.env || {}

const model = new OpenAI({
    temperature: 0.9,
    modelName: 'gpt-35-turbo',
    azureOpenAIApiKey,
    azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName,
    azureOpenAIApiVersion,
})

// @ts-ignore azure 不支持bestOf
model.bestOf = undefined

export default async function AzureCall(req: NextApiRequest, res: NextApiResponse<any>) {
    // res.status(200).json({ name: 'John Doe' })
    console.log(`model===>`, model)
    if (req.method === 'POST') {
        const modelResult = await model.call('What would be a good company name a company that makes colorful socks?')
        console.log({ modelResult })
        return res.status(200).json({ modelResult })
    }
    if (req.method === 'GET') {
        const modelResult = await model.call('What would be a good company name a company that makes colorful socks?', {
            timeout: 10000,
        })
        console.log(`AzureCall--->`, req.body)
        console.log({ modelResult })
        return res.status(200).json({ modelResult })
    }
}
