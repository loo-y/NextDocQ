export interface SpeechToken {
    authToken: string
    region: string
}

export interface WhisperAnswerState {
    careerList: CareerItem[]
    careerType?: CAREER_TYPE
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
export enum CAREER_TYPE {
    FrontEndDeveloper = '前端开发工程师',
    BackEndDeveloper = '后端开发工程师',
    UIDesigner = 'UI设计师',
}

export type AnyObj = {
    [key: string]: any
}

export type InterviewParams = {
    careerType: string
    question: string
    memoryChatKey?: string
}

export type CareerItem = {
    name: string
    text: string
    id: string
}
