export interface WhisperAnswerState {
    careerType?: CAREER_TYPE
    status: STATUS_TYPE
    value: number
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
