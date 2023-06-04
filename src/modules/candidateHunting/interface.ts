export interface CandidateHuntingState {
    resumeContent: string
    JDContent: string
    ChatQAList: ChatQAItem[]
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
    question: string
    memoryChatKey?: string
    timestamp?: number | string
}
