import React, { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { getWhisperAnswerState, updateCareerType } from '../slice'
import { STATUS_TYPE, CAREER_TYPE } from '../interface'

const CareerSelection = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getWhisperAnswerState)
    const { status } = state || {}
    console.log(`whisperAnswerState`, state)

    useEffect(() => {
        if (status == STATUS_TYPE.idle) {
            dispatch(updateCareerType(CAREER_TYPE.BackEndDevelop))
        }
    }, [status])
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
