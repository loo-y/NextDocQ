export interface SpeechToken {
    authToken: string
    region: string
}

export interface CandidateHuntingState {
    resumeContent: string
    JDContent: string
    memoryChatKey?: string
    chatQAList: ChatQAItem[]

    requestInQueueFetching: boolean
}

export interface ChatQAItem {
    ai: string
    human: string
    timestamp: number
}

export type LONG_CONTEXT_TYPE = { page: number; textlines: Array<string> }

export interface InputChangeEvent extends InputEvent {
    target: EventTarget & { files: FileList }
}
export type PdfReaderProps = {
    title?: string
    content?: string
    className?: string
    contentEditAction: (arg: any) => void
}

export type PAGE_CONTENT_TYPE = {
    page: number
    contentList: any
}

export type PageContentCollection = PAGE_CONTENT_TYPE[]

export type AnyObj = {
    [key: string]: any
}

export type InterviewQAParams = {
    humanSay: string
    aiResponse?: string
    noMemory?: boolean // do not show this question in memory
    memoryChatKey?: string
    timestamp?: number | string
}

export type InterviewInitParams = {
    resumeContent?: string
    JDContent?: string
    systemChatText?: string
}

export enum CHATQA_BUTTON_STATUS {
    start = 'start',
    stop = 'stop',
    pause = 'pause',
}
