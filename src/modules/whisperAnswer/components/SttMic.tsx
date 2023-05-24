// Speech to text by microphone
import _ from 'lodash'
import React, { useEffect, Fragment, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { getWhisperAnswerState, getSpeechTokenAsync } from '../slice'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk'
import { AnyObj, SpeechToken } from '../interface'
const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

const SttMic = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getWhisperAnswerState)
    const { speechToken } = state || {}
    const [triggerMic, setTriggerMic] = useState(false)
    useEffect(() => {
        dispatch(getSpeechTokenAsync())
    }, [])

    useEffect(() => {
        if (!speechToken) {
            dispatch(getSpeechTokenAsync())
        } else if (triggerMic) {
            console.log('state.speechToken', speechToken)
            sttFromMic(speechToken, setTriggerMic)
        }
    }, [speechToken, triggerMic])

    return (
        <div>
            <label onClick={() => setTriggerMic(true)}>aaaa</label>
        </div>
    )
}

export default SttMic

const sttFromMic = async (speechToken: SpeechToken, callback?: (arg: any) => void) => {
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(speechToken.authToken, speechToken.region)
    speechConfig.speechRecognitionLanguage = 'zh-CN'

    const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput()
    const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig)

    // this.setState({
    //     displayText: 'speak into your microphone...'
    // });

    recognizer.recognizing = function (s: any, e: AnyObj) {
        console.log('RECOGNIZING: ' + e.result.text)
        console.log('Offset in Ticks: ' + e.result.offset)
        console.log('Duration in Ticks: ' + e.result.duration)
    }

    // recognizer.startContinuousRecognitionAsync();

    if (callback) {
        callback(false)
    }
    // recognizer.recognizeOnceAsync(result => {
    //     let displayText;
    //     if (result.reason === ResultReason.RecognizedSpeech) {
    //         displayText = `RECOGNIZED: Text=${result.text}`
    //     } else {
    //         displayText = 'ERROR: Speech was cancelled or could not be recognized. Ensure your microphone is working properly.';
    //     }

    //     this.setState({
    //         displayText: this.state.displayText + `\r\n${result.text}`
    //     });

    // });
}
