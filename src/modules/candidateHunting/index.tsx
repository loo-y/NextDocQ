import React, { useEffect, Fragment, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import PdfReader from './PdfReader'
import { getCandidateHuntingState, updateResumeContent, updateJDContent } from './slice'

const ResumeJobReader = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getCandidateHuntingState)
    const { resumeContent, JDContent } = state || {}
    const handleResumeContentEdit = (resumeContent: string) => {
        console.log(`handleResumeContentEdit`, resumeContent)
        dispatch(updateResumeContent({ resumeContent }))
    }
    const handleJDContentEdit = (JDContent: string) => {
        console.log(`handleJDContentEdit`, JDContent)
        dispatch(updateJDContent({ JDContent }))
    }
    return (
        <div>
            <PdfReader title={`上传简历`} content={resumeContent} contentEditAction={handleResumeContentEdit} />
            <PdfReader title={`上传JD`} content={JDContent} contentEditAction={handleJDContentEdit} />
        </div>
    )
}

export default ResumeJobReader
