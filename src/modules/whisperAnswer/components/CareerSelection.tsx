import React, { useEffect, Fragment, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks'
import { getWhisperAnswerState, updateCareerType } from '../slice'
import { STATUS_TYPE, CAREER_TYPE } from '../interface'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { classNames } from '@/utils'
import _ from 'lodash'
import SttMic from './SttMic'

const CareerSelection = () => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getWhisperAnswerState)
    const { careerType } = state
    // console.log(`whisperAnswerState`, state)

    const careerTypeList = _.map(_.keys(CAREER_TYPE), key => {
        return {
            key,
            // @ts-ignore
            name: CAREER_TYPE[key],
        }
    })

    const [selected, setSelected] = useState(
        careerType
            ? _.find(careerTypeList, c => {
                  return c?.key == careerType
              })
            : careerTypeList[0]
    )
    useEffect(() => {
        if (!careerType) {
            const initCareerType: any = careerTypeList[0]
            setSelected(initCareerType)
            dispatch(updateCareerType(initCareerType.key))
        }
    }, [])

    const handleSelect = (careerType: any) => {
        setSelected(careerType)
        dispatch(updateCareerType(careerType.key))
    }
    return (
        <div className="">
            <Listbox value={selected} onChange={handleSelect}>
                {({ open }) => (
                    <>
                        <div className="relative">
                            <Listbox.Label className="inline text-sm font-medium leading-6 text-gray-900">
                                职位选择
                            </Listbox.Label>
                            <div className="absolute right-0 -top-2">
                                <SttMic />
                            </div>
                        </div>
                        <div className="relative mt-2">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                                <span className="flex items-center">
                                    <span className="block truncate">{selected?.name}</span>
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {_.map(careerTypeList, (career, indexCareer) => (
                                        <Listbox.Option
                                            key={`career-${indexCareer}`}
                                            className={({ active }) =>
                                                classNames(
                                                    active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                                                    'relative cursor-default select-none py-2 pl-3 pr-9'
                                                )
                                            }
                                            value={career}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <div className="flex items-center">
                                                        <span
                                                            className={classNames(
                                                                selected ? 'font-semibold' : 'font-normal',
                                                                'block truncate'
                                                            )}
                                                        >
                                                            {career.name}
                                                        </span>
                                                    </div>

                                                    {selected ? (
                                                        <span
                                                            className={classNames(
                                                                active ? 'text-white' : 'text-indigo-600',
                                                                'absolute inset-y-0 right-0 flex items-center pr-4'
                                                            )}
                                                        >
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        </div>
    )
}

export default CareerSelection
