import type { NextPage } from 'next'
import WhisperAnswerModule from '../modules/whisperAnswer/WhisperAnswer'
import { fetchCareerList } from '../modules/whisperAnswer/API'
import { useEffect } from 'react'
import { useAppDispatch } from '@/hooks'
import { updateServerData } from '../modules/whisperAnswer/slice'

const WhisperAnswer: NextPage<{ serverSideData: any }, any> = ({ serverSideData }: { serverSideData: any }) => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        console.log(`serverSideData`, serverSideData)
        dispatch(updateServerData(serverSideData))
    }, [serverSideData])
    return (
        <div>
            <WhisperAnswerModule />
        </div>
    )
}

export default WhisperAnswer

export async function getServerSideProps() {
    // Fetch data from external API
    const isServer = true
    const careerListRes = await fetchCareerList(isServer)
    const { careerList, status } = careerListRes || {}
    console.log(`careerListRes`, careerListRes)
    const serverSideData = {
        careerList: status && careerList,
    }
    // Pass data to the page via props
    return { props: { serverSideData } }
}
