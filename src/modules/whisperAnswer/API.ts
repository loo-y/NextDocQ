import { AnyObj, InterviewParams } from './interface'

const commonOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
}

export const fetchCount = async (amount = 1): Promise<{ data: number }> => {
    const response = await fetch('/api/counter', {
        ...commonOptions,
        body: JSON.stringify({ amount }),
    })
    const result = await response.json()

    return result
}

export const fetchInterviewAnswer = async (interviewParams: InterviewParams): Promise<AnyObj> => {
    const params: InterviewParams = {
        ...interviewParams,
    }
    let errorInfo = undefined
    try {
        const response = await fetch('/api/azure/interview', {
            ...commonOptions,
            body: JSON.stringify(params),
        })
        const result = await response.json()

        return {
            ...result,
            status: true,
        }
    } catch (e) {
        console.log(`fetchInterviewAnswer`, { error: e })
        errorInfo = e
    }

    return {
        status: false,
        errorInfo,
    }
}
