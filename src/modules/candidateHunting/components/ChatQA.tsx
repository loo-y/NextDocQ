import React, { useEffect, Fragment, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { getCandidateHuntingState, initInterviewAsync, getAiAnswerAsync } from '../slice'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon, InformationCircleIcon } from '@heroicons/react/20/solid'
import _ from 'lodash'
import ReactMarkdown from 'react-markdown'
import { CHATQA_BUTTON_STATUS } from '../interface'

const ChatQA = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getCandidateHuntingState)
    const { chatQAList, resumeContent, JDContent } = state
    const [tipsText, setTipsText] = useState(`开始后请耐心等待，每次需等待提问语音结束才可开始回答。`)
    const [buttonStatus, setButtonStatus] = useState(CHATQA_BUTTON_STATUS.start)
    const showList = chatQAList
    const handleQABtn = () => {
        if (buttonStatus == CHATQA_BUTTON_STATUS.start) {
            setButtonStatus(CHATQA_BUTTON_STATUS.pause)
            setTipsText(`正在录音中，请说话`)
            dispatch(initInterviewAsync(null))
            dispatch(getAiAnswerAsync({ humanSay: '你好', noMemory: true }))
        } else {
            setButtonStatus(CHATQA_BUTTON_STATUS.start)
            setTipsText(`开始后请耐心等待，每次需等待提问语音结束才可开始回答。`)
        }
    }
    if (!resumeContent || !JDContent) return null
    return (
        <div className="">
            <button
                type="button"
                className={`min-w-[3rem] inline-flex w-full justify-center rounded-md bg-zinc-700 px-3 py-1 text-m font-semibold text-white shadow-sm hover:bg-zinc-800 sm:ml-3 sm:w-auto`}
                onClick={handleQABtn}
            >
                {buttonStatus}
            </button>
            <Tips tipsText={tipsText} />
            {_.map(showList, (item, index) => {
                const { ai, human, timestamp } = item || {}
                return (
                    <>
                        <Disclosure
                            // defaultOpen={index > 0 ? false : true}
                            defaultOpen={true}
                            key={`answer_${timestamp}`}
                            as="div"
                            className="mt-2"
                        >
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                                        <span>{ai}</span>
                                        <ChevronUpIcon
                                            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`}
                                        />
                                    </Disclosure.Button>
                                    {human ? (
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 overflow-x-scroll">
                                            <ReactMarkdown>{human}</ReactMarkdown>
                                        </Disclosure.Panel>
                                    ) : null}
                                </>
                            )}
                        </Disclosure>
                    </>
                )
            })}
        </div>
    )
}

export default ChatQA

const LoadingSVG = () => {
    return (
        <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-violet-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    )
}

const Tips = ({ tipsText }: { tipsText: string }) => {
    if (!tipsText) return null
    return (
        <div className="inline-block relative ml-2">
            <div className="absolute w-6 h-6 mr-2 left-0">
                <InformationCircleIcon className="h-6 w-6    text-gray-400" />
            </div>
            <div className="text-gray-400 text-m ml-6">{tipsText}</div>
        </div>
    )
}
