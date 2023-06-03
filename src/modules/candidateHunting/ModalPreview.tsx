import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const ModalPreview = (props: {
    children: any
    isOpen?: boolean
    closeCallback?: (arg?: any) => void
    title?: string
    showButton?: boolean
}) => {
    const { children, title, showButton, isOpen = false, closeCallback } = props || {}

    const [open, setOpen] = useState(isOpen)

    const cancelButtonRef = useRef(null)
    useEffect(() => {
        setOpen(isOpen)
    }, [isOpen])

    const handleClose = (isClose: boolean) => {
        console.log(`handleClose`, isClose)
        if (closeCallback) {
            closeCallback(isClose)
        } else {
            setOpen(isClose)
        }
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full h-full w-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative max-w-[80%] max-h-[90%] transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8">
                                <div className="bg-white relative px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="text-center sm:text-left">
                                            {title ? (
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-base mb-3 font-semibold leading-6 text-gray-900"
                                                >
                                                    {title}
                                                </Dialog.Title>
                                            ) : null}

                                            <div className="mt-2 relative max-h-[70vh] max-w-full overflow-scroll">
                                                {children}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {showButton ? (
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => setOpen(false)}
                                        >
                                            Deactivate
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setOpen(false)}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : null}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default ModalPreview
