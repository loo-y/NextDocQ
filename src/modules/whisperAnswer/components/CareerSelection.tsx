import React from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { getWhisperAnswerState } from '../slice'

const CareerSelection = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getWhisperAnswerState)
    console.log(`whisperAnswerState`, state)
    return (
        <div>
            <h1>Career Selection</h1>
            <p>What career would you like to pursue?</p>
            <p>1. Doctor</p>
            <p>2. Lawyer</p>
            <p>3. Engineer</p>
            <p>4. Teacher</p>
            <p>5. Business</p>
            <p>6. Other</p>
        </div>
    )
}

export default CareerSelection
