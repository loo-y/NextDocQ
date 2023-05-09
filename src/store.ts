import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import whisperAnswerReducer from './modules/whisperAnswer/slice'

export function makeStore() {
    return configureStore({
        reducer: { whisperAnswer: whisperAnswerReducer },
        // enhancers: [composeWithDevTools(applyMiddleware(thunkMiddleware))]
    })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>

export default store
