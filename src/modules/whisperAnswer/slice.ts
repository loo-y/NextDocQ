import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppState, AppThunk } from '../../store'
import * as API from './API'
import { fetchCount, fetchTokenOrRefresh, fetchInterviewAnswer, fetchCareerList, fetchHello } from './API'
import { WhisperAnswerState, STATUS_TYPE, RECORDING_STATUS, RecordInfo, InterviewParams, CareerItem } from './interface'
import _ from 'lodash'
import type { AsyncThunk } from '@reduxjs/toolkit'

// define a queue to store api request
type APIFunc = (typeof API)[keyof typeof API]
type RequestCombo = {
    apiRequest: APIFunc
    asyncThunk?: AsyncThunk<any, any, any>
}
const apiRequestQueue: Array<RequestCombo> = []

const initialState: WhisperAnswerState = {
    careerList: [],
    requestInQueueFetching: false,
    selectedCareer: undefined,
    status: STATUS_TYPE.idle,
    value: 0,
    speechToken: undefined,
    memoryChatKey: new Date().getTime().toString(),
    recordInfo: {
        text: undefined, // text of recorded
        status: RECORDING_STATUS.idle, // status of recording
        recordingText: undefined, // text of recording
    },
    chatList: [],
}

// define a thunk action to wrap api request
export const makeApiRequestInQueue = createAsyncThunk(
    'whisperAnswerSlice/makeApiRequestInQueue',
    async (requestCombo: RequestCombo, { dispatch, getState }: any) => {
        const whisperAnswerState = getWhisperAnswerState(getState())
        const { requestInQueueFetching } = whisperAnswerState || {}

        // 将接口请求添加到队列中，并设置isFetching为true
        apiRequestQueue.push(requestCombo)

        if (requestInQueueFetching) {
            // if there is a request in progress, return a resolved Promise
            return Promise.resolve()
        }

        const { setRequestInQueueFetching } = whisperAnswerSlice.actions
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
            }
        }

        // set RequestInQueueFetching to false when all requests are processed
        dispatch(setRequestInQueueFetching(false))
    }
)

export const getHelloAsync = createAsyncThunk('whisperAnswerSlice/fetchHello', async (data, { dispatch, getState }) => {
    dispatch(
        makeApiRequestInQueue({
            apiRequest: fetchHello.bind(null),
            asyncThunk: getHelloAsync,
        })
    )
    // const response = await fetchHello()
    // const { status, hello, errorInfo } = response || {}

    // if (status && !_.isEmpty(hello)) {
    //     return hello
    // }
    // return ''
})

export const getCareerListAsync = createAsyncThunk('whisperAnswerSlice/fetchCareerList', async () => {
    const response = await fetchCareerList()
    const { status, careerList, errorInfo } = response || {}
    if (status && !_.isEmpty(careerList)) {
        return careerList
    }
    return []
})

export const getAiAnswerAsync = createAsyncThunk(
    'whisperAnswerSlice/fetchInterviewAnswer',
    async (question: string, { getState, extra, dispatch }: any) => {
        const whisperAnswerState: WhisperAnswerState = getWhisperAnswerState(getState())
        console.log(`whisperAnswerState`, whisperAnswerState)
        const { selectedCareer, memoryChatKey } = whisperAnswerState || {}
        if (!selectedCareer?.id) {
            return {}
        }
        dispatch(
            makeApiRequestInQueue({
                apiRequest: fetchInterviewAnswer.bind(null, {
                    question,
                    careerType: selectedCareer.id,
                    memoryChatKey,
                }),
                asyncThunk: getAiAnswerAsync,
            })
        )

        // const response = await fetchInterviewAnswer({
        //     question,
        //     careerType: selectedCareer.id,
        //     memoryChatKey,
        // })
        // const { status, result, error } = response || {}
        // if (status && !_.isEmpty(result)) {
        //     return result
        // }
        // return {}
    }
)
export const getSpeechTokenAsync = createAsyncThunk('whisperAnswerSlice/fetchTokenOrRefresh', async () => {
    const response = await fetchTokenOrRefresh()
    const { status, authToken, region } = response || {}
    if (status) {
        return {
            authToken,
            region,
        }
    }
    return undefined
})

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const incrementAsync = createAsyncThunk('whisperAnswerSlice/fetchCount', async (amount: number) => {
    console.log(`1111`)
    const response = await fetchCount(amount)
    // The value we return becomes the `fulfilled` action payload
    console.log(`2222`)
    return response.data
})

const updateSelectedCareerReducer = (state: any, action: PayloadAction<CareerItem>) => {
    state.selectedCareer = action.payload
}

export const whisperAnswerSlice = createSlice({
    name: 'whisperAnswerSlice',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setRequestInQueueFetching: (state, action: PayloadAction<boolean>) => {
            state.requestInQueueFetching = action.payload
        },
        updateServerData: (state, action: PayloadAction<any>) => {
            if (!_.isEmpty(action.payload)) {
                // state = {
                //     ...state,
                //     sss: {
                //         ...action.payload,
                //     }

                // }

                // TODO need to get all data from severside
                state.careerList = action.payload.careerList
                console.log(`updateServerData result`, state)
            }
        },
        updateCareerList: (state, action: PayloadAction<CareerItem[]>) => {
            if (!_.isEmpty(action.payload)) {
                state.careerList = _.uniqBy(_.concat(state.careerList, action.payload), 'id')
            }
        },
        updateRecording: (state, action: PayloadAction<RecordInfo>) => {
            const { chatList } = state || {}
            const { text, status } = action.payload || {}
            if (status == RECORDING_STATUS.idle) {
                state.recordInfo = {
                    ...state.recordInfo,
                    text: _.compact([state.recordInfo.text, state.recordInfo.recordingText]).join(', '),
                    recordingText: '',
                    status,
                }
            } else if (status == RECORDING_STATUS.recorded) {
                state.recordInfo = {
                    ...state.recordInfo,
                    text: _.compact([state.recordInfo.text, text]).join(', '),
                    status,
                }
            } else {
                state.recordInfo = {
                    ...state.recordInfo,
                    ...action.payload,
                }
            }
        },
        clearRecording: state => {
            state.recordInfo = {
                text: undefined,
                status: RECORDING_STATUS.idle,
                recordingText: undefined,
            }
        },
        increment: state => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            state.value += 1
        },
        decrement: state => {
            state.value -= 1
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        },
        updateSelectedCareer: updateSelectedCareerReducer,
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: builder => {
        builder
            .addCase(incrementAsync.pending, state => {
                console.log(`loading`)
                state.status = STATUS_TYPE.loading
            })
            .addCase(incrementAsync.fulfilled, (state, action) => {
                console.log(`fulfilled`)
                state.status = STATUS_TYPE.fulfilled
                state.value += action.payload
            })
            .addCase(getSpeechTokenAsync.fulfilled, (state, action) => {
                console.log(`getSpeechTokenAsync.fulfilled`, { action })
                state.speechToken = action.payload
            })
            .addCase(getAiAnswerAsync.fulfilled, (state, action) => {
                // @ts-ignore
                const { status, result, error } = action.payload || {}
                const { memoryMessags } = result || {}
                if (!_.isEmpty(memoryMessags)) {
                    state.chatList = _.orderBy(memoryMessags, ['timestamp'], ['desc'])
                }
            })
            .addCase(getCareerListAsync.fulfilled, (state, action) => {
                if (!_.isEmpty(action.payload)) {
                    state.careerList = action.payload
                }
            })
            .addCase(getHelloAsync.fulfilled, (state, action) => {
                console.log(`getHelloAsync.fulfilled`, { action })
            })
            .addCase(makeApiRequestInQueue.pending, (state, action) => {
                console.log(`makeApiRequestInQueue.pending`, { action })
            })
            .addCase(makeApiRequestInQueue.fulfilled, (state, action) => {
                console.log(`makeApiRequestInQueue.fulfilled`, { action })
            })
    },
})

export const {
    updateServerData,
    updateCareerList,
    updateRecording,
    clearRecording,
    increment,
    decrement,
    incrementByAmount,
    updateSelectedCareer,
} = whisperAnswerSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// export const selectCount = (state: AppState) => state.whisperAnswer.value
export const getWhisperAnswerState = (state: AppState) => state.whisperAnswer

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
export const incrementIfOdd =
    (amount: number): AppThunk =>
    (dispatch, getState) => {
        const whisperAnswerState = getWhisperAnswerState(getState())
        const currentValue = whisperAnswerState?.value
        if (currentValue % 2 === 1) {
            dispatch(incrementByAmount(amount))
        }
    }

export default whisperAnswerSlice.reducer
