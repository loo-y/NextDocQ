import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAI } from 'langchain/llms/openai' // azure openai
import * as dotenv from 'dotenv'
dotenv.config()

const {
    azureOpenAIApiKey,
    azureOpenAIApiInstanceName,
    azureOpenAIApiDeployment_GTP35Turbo,
    azureOpenAIApiDeployment_TextDavinci003,
    azureOpenAIApiVersion,
} = process.env || {}

enum AZURE_MODELS {
    GPT35Turbo = `gpt-35-turbo`,
    TextDavinci003 = `text-davinci-003`,
}

const modelGPT35Turbo = new OpenAI({
    temperature: 0.9,
    modelName: AZURE_MODELS.GPT35Turbo,
    azureOpenAIApiKey,
    azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName: azureOpenAIApiDeployment_GTP35Turbo,
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
    azureOpenAIApiDeploymentName: azureOpenAIApiDeployment_TextDavinci003,
    azureOpenAIApiVersion,
    maxTokens: 100,
})
// @ts-ignore azure 不支持bestOf
modelTextDavinci003.bestOf = undefined

export { modelGPT35Turbo, modelTextDavinci003 }
