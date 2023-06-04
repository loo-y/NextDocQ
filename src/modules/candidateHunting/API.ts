import { AnyObj, InterviewQAParams, InterviewInitParams } from './interface'
import Cookie from 'universal-cookie'
import _ from 'lodash'

const commonOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
}

export const fetchInterviewInit = async (initParams: InterviewInitParams): Promise<AnyObj> => {
    const { systemChatText, JDContent, resumeContent } = initParams || {}
    const params = {
        systemText: systemChatText,
        JDContent,
        resumeContent,
    }
    let errorInfo = undefined
    try {
        const response = await fetch('/api/interview/init', {
            ...commonOptions,
            body: JSON.stringify(params),
        })
        const result = await response.json()
        const { isSuccess, memoryChatKey } = result || {}
        return {
            memoryChatKey,
            status: isSuccess,
        }
    } catch (e) {
        console.log(`fetchInterviewInit`, { error: e })
        errorInfo = e
    }

    return {
        status: false,
        errorInfo,
    }
}
export const fetchInterviewQA = async (interviewQAParams: InterviewQAParams): Promise<AnyObj> => {
    const params: InterviewQAParams = {
        ...interviewQAParams,
    }

    let errorInfo = undefined
    try {
        const response = await fetch('/api/interview/interviewer', {
            ...commonOptions,
            body: JSON.stringify(params),
        })
        const result = await response.json()
        return {
            result,
            status: true,
        }
    } catch (e) {
        console.log(`fetchInterviewQA`, { error: e })
        errorInfo = e
    }

    return {
        status: false,
        errorInfo,
    }
}
