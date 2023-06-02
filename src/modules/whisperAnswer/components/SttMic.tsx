// Speech to text by microphone
import _ from 'lodash'
import React, { useEffect, Fragment, useState, useCallback, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { getWhisperAnswerState, getSpeechTokenAsync, updateRecording } from '../slice'
import { ResultReason } from 'microsoft-cognitiveservices-speech-sdk'
import { AnyObj, SpeechToken, RECORDING_STATUS } from '../interface'
import { recordingIdleGap } from '@/utils/constants'
const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

const SttMic = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getWhisperAnswerState)
    const { speechToken, recordInfo } = state || {}
    const [triggerMic, setTriggerMic] = useState(false)
    const [stateRecognizer, setStateRecognizer] = useState(null)
    // console.log(`recordInfo`, recordInfo)
    // useEffect(() => {
    //     dispatch(getSpeechTokenAsync())
    // }, [])

    let lastRecordingInfo: any = {},
        recordingIdleTimer: any = null
    const handleRecording = (result: any) => {
        // console.log(`this is result`, result)
        const { resultId, text, offset, duration } = result || {}
        const lastResultoffset = lastRecordingInfo?.offset
        const lastText = lastRecordingInfo?.text || ``
        if (!!lastResultoffset && lastResultoffset != offset) {
            dispatch(
                updateRecording({
                    text: lastText,
                    recordingText: text,
                    status: RECORDING_STATUS.recorded,
                })
            )
        } else {
            dispatch(
                updateRecording({
                    recordingText: text,
                    status: RECORDING_STATUS.recording,
                })
            )
        }

        clearTimeout(recordingIdleTimer)
        recordingIdleTimer = setTimeout(() => {
            lastRecordingInfo = {}
            dispatch(
                updateRecording({
                    status: RECORDING_STATUS.idle,
                })
            )
        }, recordingIdleGap)

        lastRecordingInfo = {
            resultId,
            text,
            offset,
            duration,
        }
    }

    useEffect(() => {
        console.log(`triggerMic`, triggerMic)
        if (!speechToken) {
            console.log(`speechToken, triggerMic`, `noSpeechToken`)
            dispatch(getSpeechTokenAsync())
        } else if (triggerMic) {
            console.log('state.speechToken', speechToken)
            sttFromMic(stateRecognizer, speechToken, handleRecording, (recognizer: any) => {
                if (recognizer) {
                    setStateRecognizer(recognizer)
                }
                // setTriggerMic(false)
            })
        }
    }, [triggerMic])

    const handleStopMic = useCallback(() => {
        if (stateRecognizer) {
            pauseMic(stateRecognizer)
            setTriggerMic(false)
        }
    }, [stateRecognizer])

    return (
        <div className="w-10 inline-block text-right">
            <div
                onClick={() => {
                    triggerMic ? handleStopMic() : setTriggerMic(true)
                }}
                className="inline-block w-6 cursor-pointer align-bottom"
            >
                {triggerMic ? (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                        />
                    </svg>
                )}
            </div>
        </div>
    )
}

export default SttMic

const sttFromMic = async (
    stateRecognizer: any,
    speechToken: SpeechToken,
    recording: (arg: any) => void,
    callback?: (arg?: any) => void
) => {
    const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(speechToken.authToken, speechToken.region)
    speechConfig.speechRecognitionLanguage = 'zh-CN'

    let recognizer
    if (!stateRecognizer) {
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput()
        recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig)
    } else {
        recognizer = stateRecognizer
        recognizer.startContinuousRecognitionAsync()
        callback && callback()
        return
    }

    // this.setState({
    //     displayText: 'speak into your microphone...'
    // });

    recognizer.recognizing = function (s: any, e: AnyObj) {
        // console.log(`this is s`, s)
        // console.log(`this is e`, e)
        // console.log('RECOGNIZING: ' + e.result.text)
        // console.log('Offset in Ticks: ' + e.result.offset)
        // console.log('Duration in Ticks: ' + e.result.duration)
        console.log('Duration in Ticks: ', e.result)
        recording(e?.result)
    }

    recognizer.startContinuousRecognitionAsync()

    if (callback) {
        callback(recognizer)
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

const pauseMic = async (recognizer: any) => {
    recognizer.stopContinuousRecognitionAsync()
}
