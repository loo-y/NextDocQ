import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks'
import CareerSelection from './components/CareerSelection'
import styles from './WhipserAnswer.module.css'

const WhisperAnswer = () => {
    const dispatch = useAppDispatch()
    const [incrementAmount, setIncrementAmount] = useState('2')

    return (
        <div className={styles.body}>
            <div className="lg:flex lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Whisper Interview
                    </h2>
                </div>
                <br />
            </div>
            <CareerSelection />
        </div>
    )
}

export default WhisperAnswer

export async function getServerSideProps() {
    console.log(`getInitialProps`)
}
