import { AnyObj, InterviewQAParams } from './interface'
import Cookie from 'universal-cookie'
import _ from 'lodash'

const commonOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
}

export const fetchInterviewInit = async (systemText: string): Promise<AnyObj> => {
    const params = {
        systemText,
    }
    let errorInfo = undefined
    try {
        const response = await fetch('/api/interview/init', {
            ...commonOptions,
            body: JSON.stringify(params),
        })
        const result = await response.json()
        return {
            result,
            status: true,
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
