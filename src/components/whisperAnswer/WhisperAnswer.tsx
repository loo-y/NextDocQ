import { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../hooks'

const WhisperAnswer = () => {
    const dispatch = useAppDispatch()
    const [incrementAmount, setIncrementAmount] = useState('2')

    return (
      <div>
        {`WhisperAnswer`}
      </div>
    )
  }
  

  export default WhisperAnswer


export async function getServerSideProps(){
    console.log(`getInitialProps`)
};