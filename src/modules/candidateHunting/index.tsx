import React, { useEffect, Fragment, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import PdfReader from './components/PdfReader'
import { getCandidateHuntingState, updateResumeContent, updateJDContent } from './slice'
import ChatQA from './components/ChatQA'

const ResumeJobReader = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getCandidateHuntingState)
    const { resumeContent, JDContent } = state
    const handleResumeContentEdit = (resumeContent: string) => {
        console.log(`handleResumeContentEdit`, resumeContent)
        dispatch(updateResumeContent({ resumeContent }))
    }
    const handleJDContentEdit = (JDContent: string) => {
        console.log(`handleJDContentEdit`, JDContent)
        dispatch(updateJDContent({ JDContent }))
    }
    return (
        <div className="px-5 w-full pt-4">
            <div className="w-full px-4">
                <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-2 mb-4">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                Candidate Hunting
                            </h2>
                        </div>
                        <br />
                    </div>
                </div>
                <div className="mx-auto w-full max-w-6xl bg-white p-2 pb-4 border-b-2 border-solid mb-4 border-fuchsia-800">
                    <div className="flex">
                        <PdfReader
                            className="flex-1 mr-10"
                            title={`上传简历`}
                            content={resumeContent}
                            contentEditAction={handleResumeContentEdit}
                        />
                        <PdfReader
                            className="flex-1 ml-10"
                            title={`上传JD`}
                            content={JDContent}
                            contentEditAction={handleJDContentEdit}
                        />
                    </div>
                </div>
                <ChatQA />
            </div>
        </div>
    )
}

export default ResumeJobReader
