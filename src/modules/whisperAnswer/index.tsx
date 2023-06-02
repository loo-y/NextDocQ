import { useState } from 'react'
import CareerSelection from './components/CareerSelection'
import ChatAnswer from './components/ChatAnswer'
import SttMic from './components/SttMic'
import styles from './WhipserAnswer.module.css'

const WhisperAnswer = () => {
    return (
        <div className={styles.body}>
            <div className="px-5 w-full pt-4">
                <div className="w-full px-4">
                    <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-2 mb-4">
                        <div className="lg:flex lg:items-center lg:justify-between">
                            <div className="min-w-0 flex-1">
                                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                                    Whisper Interview
                                </h2>
                            </div>
                            <br />
                        </div>
                    </div>
                    <div className="mx-auto w-full max-w-6xl rounded-2xl bg-white p-2">
                        <CareerSelection />
                        {/* <SttMic /> */}
                        <ChatAnswer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhisperAnswer

export async function getServerSideProps() {
    console.log(`getInitialProps`)
}
