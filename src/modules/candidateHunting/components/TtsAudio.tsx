// Text to speech audio
import _ from 'lodash'
import React, { useEffect, Fragment, useState, useCallback, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { getCandidateHuntingState } from '../slice'
import { AnyObj, SpeechToken } from '../interface'
import { SpeechConfig, AudioConfig } from 'microsoft-cognitiveservices-speech-sdk'
const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

const TtsAudio = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getCandidateHuntingState)

    return <div></div>
}

export default TtsAudio

type SynthesizeSpeechProps = {
    textContent: string
    speechToken: SpeechToken
    speechConfig?: SpeechConfig
    audioConfig?: AudioConfig
    callback?: (arg?: any) => void
}

const synthesizeSpeech = ({ textContent, speechToken, speechConfig, audioConfig }: SynthesizeSpeechProps) => {
    if (!textContent) return
    // const speechConfig = speechsdk.SpeechConfig.fromSubscription("YourSpeechKey", "YourSpeechRegion");
    // TODO save speechConfig and audioConfig into state
    const synthesizeSpeechConfig: SpeechConfig =
        speechConfig || speechsdk.SpeechConfig.fromAuthorizationToken(speechToken.authToken, speechToken.region)
    const synthesizeAudioConfig: AudioConfig = audioConfig || speechsdk.AudioConfig.fromDefaultSpeakerOutput()

    // set language and voice https://aka.ms/speech/tts-languages
    synthesizeSpeechConfig.speechSynthesisLanguage = 'zh-CN'
    synthesizeSpeechConfig.speechSynthesisVoiceName = 'zh-CN-XiaochenNeural'

    const speechSynthesizer = new speechsdk.SpeechSynthesizer(synthesizeSpeechConfig, synthesizeAudioConfig)
    speechSynthesizer.speakTextAsync(
        textContent,
        (result: any) => {
            if (result) {
                speechSynthesizer.close()
                return result.audioData
            }
        },
        (error: object | string) => {
            console.log(error)
            speechSynthesizer.close()
        }
    )
}
