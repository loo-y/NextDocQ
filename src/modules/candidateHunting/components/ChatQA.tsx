import React, { useEffect, Fragment, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { getCandidateHuntingState } from '../slice'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import _ from 'lodash'
import ReactMarkdown from 'react-markdown'

const ChatQA = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getCandidateHuntingState)
    const { ChatQAList } = state

    const showList = ChatQAList

    return (
        <div className="">
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
                                        <span>{human}</span>
                                        <ChevronUpIcon
                                            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`}
                                        />
                                    </Disclosure.Button>
                                    {ai ? (
                                        <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 overflow-x-scroll">
                                            {/* {ai} */}
                                            <ReactMarkdown>{ai}</ReactMarkdown>
                                        </Disclosure.Panel>
                                    ) : (
                                        <div className="mt-2 w-full relative h-6">
                                            <div className="w-5 h-5 absolute top-0 translate-x-2/4 right-1/2">
                                                <LoadingSVG />
                                            </div>
                                        </div>
                                    )}
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
