import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/20/solid'
import _ from 'lodash'

const sample = [
    {
        ai: '안녕하세요',
        human: '안녕하세요',
    },
    {
        ai: '什么是react',
        human: '我也不知道啊',
    },
]

const ChatAnswer = () => {
    if (_.isEmpty(sample)) return null
    return (
        <div className="w-full px-4 pt-2">
            <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
                {_.map(sample, (item, index) => {
                    const { ai, human } = item || {}

                    return (
                        <Disclosure
                            defaultOpen={index > 0 ? false : true}
                            key={`answer_${index}`}
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
                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                        {human}
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                    )
                })}
            </div>
        </div>
    )
}

export default ChatAnswer
