import { AnyObj, InterviewParams } from './interface'
import Cookie from 'universal-cookie'
import _ from 'lodash'

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
        const response = await fetch('/api/interview/interviewee', {
            ...commonOptions,
            body: JSON.stringify(params),
        })
        const result = await response.json()
        return {
            result,
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

export const fetchTokenOrRefresh = async () => {
    const cookie = new Cookie()
    const speechTokenCookieName = 'speech-token'
    const speechToken = cookie.get(speechTokenCookieName)

    if (speechToken === undefined) {
        try {
            const response = await fetch('/api/azure/speechcheck', {
                ...commonOptions,
                method: 'GET',
            })
            const result = await response.json()
            const { token, region } = result || {}
            cookie.set(speechTokenCookieName, region + ':' + token, { maxAge: 540, path: '/' })
            console.log('Token fetched from back-end: ' + token)
            return { status: true, authToken: token, region: region }
        } catch (err) {
            return { status: false, authToken: null, errorInfo: err }
        }
    } else {
        console.log('Token fetched from cookie: ' + speechToken)
        const idx = speechToken.indexOf(':')
        return { status: true, authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) }
    }
}

export const fetchCareerList = async (isServer?: boolean) => {
    let errorInfo
    try {
        const url = isServer ? 'http://localhost:3000/api/interview/careerlist' : '/api/interview/careerlist'
        const response = await fetch(url, {
            ...commonOptions,
        })
        const result = await response.json()
        if (result?.careerList) {
            return {
                careerList: result.careerList,
                status: true,
            }
        }
    } catch (e) {
        console.log(`fetchCareerList`, { error: e })
        errorInfo = e
    }

    return {
        status: false,
        errorInfo,
    }
}

export const fetchHello = async () => {
    let errorInfo
    try {
        const response = await fetch('/api/hello', {
            ...commonOptions,
        })
        const result = await response.json()
        if (result) {
            return {
                hello: result,
                status: true,
            }
        }
    } catch (e) {
        console.log(`fetchHello`, { error: e })
        errorInfo = e
    }

    return {
        status: false,
        errorInfo,
    }
}

export const fetchChatList = async ({ memoryChatKey }: { memoryChatKey: string }) => {
    let errorInfo
    try {
        const response = await fetch('/api/interview/chatlist', {
            ...commonOptions,
            body: JSON.stringify({
                memoryChatKey,
            }),
        })
        const result = await response.json()
        if (!_.isEmpty(result?.chatList)) {
            return {
                chatList: result.chatList,
                status: true,
            }
        }
    } catch (e) {
        console.log(`fetchHello`, { error: e })
        errorInfo = e
    }

    return {
        status: false,
        errorInfo,
    }
}
