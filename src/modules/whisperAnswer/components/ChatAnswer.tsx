import React, { useEffect, Fragment, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { getWhisperAnswerState, getAiAnswerAsync, clearRecording } from '../slice'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import _ from 'lodash'

const ChatAnswer = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getWhisperAnswerState)
    const { chatList, recordInfo } = state || {}

    // useEffect(() => {
    //     dispatch(getAiAnswerAsync(`ffff`))
    // }, [])

    useEffect(() => {
        console.log(`recordInfo`, recordInfo)
        const { status, text } = recordInfo || {}
        if (status === `idle` && text) {
            dispatch(getAiAnswerAsync(text))
            dispatch(clearRecording())
        }
    }, [recordInfo])

    if (_.isEmpty(chatList)) return null
    return (
        <div className="">
            {_.map(chatList, (item, index) => {
                const { ai, human, timestamp } = item || {}

                return (
                    <Disclosure
                        defaultOpen={index > 0 ? false : true}
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
                                <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                    {ai}
                                </Disclosure.Panel>
                            </>
                        )}
                    </Disclosure>
                )
            })}
        </div>
    )
}

export default ChatAnswer
