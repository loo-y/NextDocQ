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
    FrontEndWebDeveloper = '前端Web开发工程师',
    BackEndDevelop = '后端开发工程师',
    UI = 'UI设计师',
}
