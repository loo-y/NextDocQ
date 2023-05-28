export interface SpeechToken {
    authToken: string
    region: string
}

export interface WhisperAnswerState {
    requestInQueueFetching: boolean
    careerList: CareerItem[]
    selectedCareer?: CareerItem
    status: STATUS_TYPE
    memoryChatKey?: string
    value: number
    speechToken?: SpeechToken
    recordInfo: RecordInfo

    chatList: ChatItem[]
}

export interface ChatItem {
    ai: string
    human: string
    timestamp: number
}
export interface RecordInfo {
    status: RECORDING_STATUS
    text?: string
    recordingText?: string
}
export enum RECORDING_STATUS {
    idle = 'idle',
    recording = 'recording',
    recorded = 'recorded',
}
export enum STATUS_TYPE {
    idle = 'idle',
    loading = 'loading',
    fulfilled = 'fulfilled',
}

export type AnyObj = {
    [key: string]: any
}

export type InterviewParams = {
    careerType: string
    question: string
    memoryChatKey?: string
    timestamp?: number | string
}

export type CareerItem = {
    name: string
    text: string
    id: string
}
