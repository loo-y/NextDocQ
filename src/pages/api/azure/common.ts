import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'langchain/llms/openai' // azure openai
import * as dotenv from 'dotenv'
dotenv.config()

const { azureOpenAIApiKey, azureOpenAIApiInstanceName, azureOpenAIApiDeploymentName, azureOpenAIApiVersion } =
    process.env || {}

enum AZURE_MODELS {
    GPT35Turbo = `gpt-35-turbo`,
    TextDavinci003 = `text-davinci-003`,
}

console.log(`AZURE_MODELS`, AZURE_MODELS)
console.log(AZURE_MODELS.GPT35Turbo)
console.log(AZURE_MODELS.TextDavinci003)

const modelGPT35Turbo = new OpenAI({
    temperature: 0.9,
    modelName: AZURE_MODELS.GPT35Turbo,
    azureOpenAIApiKey,
    azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName,
    azureOpenAIApiVersion,
    maxTokens: 100,
})
// @ts-ignore azure 不支持bestOf
modelGPT35Turbo.bestOf = undefined

const modelTextDavinci003 = new OpenAI({
    temperature: 0.9,
    modelName: AZURE_MODELS.TextDavinci003,
    azureOpenAIApiKey,
    azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName,
    azureOpenAIApiVersion,
    maxTokens: 100,
})
// @ts-ignore azure 不支持bestOf
modelTextDavinci003.bestOf = undefined

export { modelGPT35Turbo, modelTextDavinci003 }
