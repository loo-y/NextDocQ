import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppState, AppThunk } from '../../store'
import { CandidateHuntingState } from './interface'
import * as API from './API'
import { fetchInterviewInit, fetchInterviewQA } from './API'
import type { AsyncThunk } from '@reduxjs/toolkit'
import { sortUniqKey } from '@/utils/constants'
import _ from 'lodash'

type APIFunc = (typeof API)[keyof typeof API]
type RequestCombo = {
    apiRequest: APIFunc
    asyncThunk?: AsyncThunk<any, any, any>
}
const apiRequestQueue: Array<RequestCombo> = []

const initialState: CandidateHuntingState = {
    resumeContent: '',
    JDContent: '',
    chatQAList: [],
    memoryChatKey: undefined,
    requestInQueueFetching: false,
}

// define a thunk action to wrap api request
const makeApiRequestInQueue = createAsyncThunk(
    'candidateHuntingSlice/makeApiRequestInQueue',
    async (requestCombo: RequestCombo, { dispatch, getState }: any) => {
        const candidateHuntingState = getCandidateHuntingState(getState())
        const { requestInQueueFetching } = candidateHuntingState || {}

        // 将接口请求添加到队列中，并设置isFetching为true
        apiRequestQueue.push(requestCombo)

        if (requestInQueueFetching) {
            // if there is a request in progress, return a resolved Promise
            return Promise.resolve()
        }

        const { setRequestInQueueFetching } = candidateHuntingSlice.actions
        dispatch(setRequestInQueueFetching(true))

        // loop through the queue and process each request
        while (apiRequestQueue.length > 0) {
            const nextRequestCombo = apiRequestQueue.shift()
            if (nextRequestCombo) {
                const { apiRequest, asyncThunk } = nextRequestCombo || {}

                // send api request
                try {
                    // @ts-ignore
                    asyncThunk && dispatch(asyncThunk.pending())
                    // @ts-ignore
                    dispatch(makeApiRequestInQueue.pending())
                    // @ts-ignore
                    const response = await apiRequest()
                    // @ts-ignore
                    asyncThunk && dispatch(asyncThunk.fulfilled(response))
                    // @ts-ignore
                    dispatch(makeApiRequestInQueue.fulfilled(response))
                } catch (error) {
                    // @ts-ignore
                    asyncThunk && dispatch(asyncThunk.rejected(error))
                    // @ts-ignore
                    dispatch(makeApiRequestInQueue.rejected(error))
                }
                // wait state dispatch to finish
                await new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(true)
                    }, 50)
                })
            }
        }
        // set RequestInQueueFetching to false when all requests are processed
        dispatch(setRequestInQueueFetching(false))
    }
)

export const initInterviewAsync = createAsyncThunk(
    'whisperAnswerSlice/fetchInterviewInit',
    async (systemChatText: string | null, { dispatch, getState }: any) => {
        const candidateHuntingState: CandidateHuntingState = getCandidateHuntingState(getState())
        const { resumeContent, JDContent } = candidateHuntingState || {}
        systemChatText = systemChatText || ''

        if (!systemChatText && !(resumeContent && JDContent)) return { status: false, memoryChatKey: undefined }

        dispatch(
            makeApiRequestInQueue({
                apiRequest: fetchInterviewInit.bind(null, { resumeContent, JDContent, systemChatText }),
                asyncThunk: initInterviewAsync,
            })
        )
    }
)

export const getAiAnswerAsync = createAsyncThunk(
    'whisperAnswerSlice/fetchInterviewQA',
    async (question: string, { dispatch, getState }: any) => {
        const candidateHuntingState: CandidateHuntingState = getCandidateHuntingState(getState())
        const memoryChatKey = candidateHuntingState?.memoryChatKey
        console.log(`candidateHuntingState, getAiAnswerAsync`, candidateHuntingState)
        if (!memoryChatKey || !question) return { result: null, status: false }

        const timestamp = Date.now()

        dispatch(
            makeApiRequestInQueue({
                apiRequest: fetchInterviewQA.bind(null, { memoryChatKey, question, timestamp }),
                asyncThunk: getAiAnswerAsync,
            })
        )
    }
)

export const candidateHuntingSlice = createSlice({
    name: 'candidateHuntingSlice',
    initialState,
    reducers: {
        setRequestInQueueFetching: (state, action: PayloadAction<boolean>) => {
            state.requestInQueueFetching = action.payload
        },
        updateResumeContent: (state, action: PayloadAction<{ resumeContent: string }>) => {
            // state.resumeContent = action.payload.resumeContent
            return {
                ...state,
                resumeContent: action.payload.resumeContent,
            }
        },
        updateJDContent: (state, action: PayloadAction<{ JDContent: string }>) => {
            return {
                ...state,
                JDContent: action.payload.JDContent,
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(makeApiRequestInQueue.pending, (state, action) => {
                console.log(`makeApiRequestInQueue.pending`, { action })
            })
            .addCase(makeApiRequestInQueue.fulfilled, (state, action) => {
                console.log(`makeApiRequestInQueue.fulfilled`, { action })
            })
            .addCase(initInterviewAsync.fulfilled, (state, action) => {
                console.log(`initInterviewAsync.fulfilled`, action.payload)
                const { status, memoryChatKey } = action.payload || {}
                if (status && memoryChatKey) {
                    state.memoryChatKey = memoryChatKey
                }
            })
            .addCase(getAiAnswerAsync.fulfilled, (state, action) => {
                const { status, result } = action.payload || {}
                // @ts-ignore
                const { memoryMessags } = result || {}
                if (!_.isEmpty(memoryMessags)) {
                    state.chatQAList = _.orderBy(
                        _.uniqBy(_.concat(memoryMessags, state.chatQAList), sortUniqKey),
                        [sortUniqKey],
                        ['desc']
                    )
                }
            })
    },
})

export const { updateResumeContent, updateJDContent } = candidateHuntingSlice.actions

export const getCandidateHuntingState = (state: AppState) => state.candidateHunting

export default candidateHuntingSlice.reducer
