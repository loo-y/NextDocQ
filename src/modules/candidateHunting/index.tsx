import React, { useEffect, Fragment, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import PdfReader from './PdfReader'
import { getCandidateHuntingState, updateResumeContent } from './slice'

const ResumeJobReader = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getCandidateHuntingState)
    const { resumeContent } = state || {}
    const handleResumeContentEdit = (resumeContent: string) => {
        console.log(`handleResumeContentEdit`, resumeContent)
        dispatch(updateResumeContent({ resumeContent }))
    }
    return (
        <div>
            <PdfReader title={`上传简历`} content={resumeContent} contentEditAction={handleResumeContentEdit} />
            <PdfReader title={`上传JD`} content={''} contentEditAction={handleResumeContentEdit} />
        </div>
    )
}

export default ResumeJobReader
