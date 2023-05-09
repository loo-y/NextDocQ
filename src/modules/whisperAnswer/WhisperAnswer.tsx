import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks'
import CareerSelection from './components/CareerSelection'
import styles from './WhipserAnswer.module.css'

const WhisperAnswer = () => {
    const dispatch = useAppDispatch()
    const [incrementAmount, setIncrementAmount] = useState('2')

    return (
      <div className={styles.body}>
        <CareerSelection />
      </div>
    )
  }
  

  export default WhisperAnswer


export async function getServerSideProps(){
    console.log(`getInitialProps`)
};