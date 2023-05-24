import MicrosoftSpeechSdk from 'microsoft-cognitiveservices-speech-sdk'
import _ from 'lodash'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as dotenv from 'dotenv'
dotenv.config()

const { azureSpeechKey = '', azureSpeechregion = '' } = process.env || {}

// const speechConfig = MicrosoftSpeechSdk.SpeechConfig.fromSubscription(azureSpeechKey, azureSpeechregion);
// speechConfig.speechRecognitionLanguage = "zh-CN";
// https://learn.microsoft.com/en-us/azure/cognitive-services/speech-service/language-support?tabs=stt#speech-to-text

export default async function AzureSpeechCheck(req: NextApiRequest, res: NextApiResponse<any>) {
    res.setHeader('Content-Type', 'application/json')
    if (azureSpeechKey === 'paste-your-speech-key-here' || azureSpeechregion === 'paste-your-speech-region-here') {
        res.status(400).send('auth failed')
    } else {
        const params = {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': azureSpeechKey,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: null,
        }

        try {
            const tokenResponse: any = await fetch(
                `https://${azureSpeechregion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
                params
            )
            const tokenResponseResult = await tokenResponse.text()
            if (tokenResponseResult) {
                res.send({ token: tokenResponseResult, region: azureSpeechregion, tokenResponse })
            } else {
                res.status(401).send('There was an error authorizing your speech key. no tokenResponse data')
            }
        } catch (err) {
            console.log(`AzureSpeechCheck`, { err })
            res.status(401).send('There was an error authorizing your speech key.')
        }
    }
}

// https://github.com/Azure-Samples/AzureSpeechReactSample
