import type { NextPage, GetServerSideProps } from 'next'
import WhisperAnswerModule from '@/modules/whisperAnswer'
import { fetchCareerList } from '../modules/whisperAnswer/API'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks'
import {
    updateServerDataToState,
    getWhisperAnswerState,
    restoreChatListByMemoryKeyAsync,
} from '../modules/whisperAnswer/slice'
import { useRouter } from 'next/router'
import _ from 'lodash'
import HeaderModule from '@/modules/header'
import { navigationEnum } from '@/utils/constants'

const WhisperAnswer: NextPage<{ serverSideData: any }, any> = ({ serverSideData }: { serverSideData: any }) => {
    const dispatch = useAppDispatch()
    const state = useAppSelector(getWhisperAnswerState)
    const { memoryChatKey } = state || {}
    const router = useRouter()
    useEffect(() => {
        dispatch(updateServerDataToState(serverSideData))
    }, [serverSideData])

    // add memoryKey in url query
    useEffect(() => {
        const { query } = router || {}
        const { mk } = query || {}
        console.log(`mk`, mk, memoryChatKey)
        if (!mk && memoryChatKey) {
            router.replace({
                pathname: router.pathname,
                query: {
                    ...query,
                    mk: memoryChatKey,
                },
            })
        }
        // TODO 这里会多次调用，需要优化
        dispatch(restoreChatListByMemoryKeyAsync(memoryChatKey))
    }, [memoryChatKey])

    return (
        <div>
            <HeaderModule current={navigationEnum.whisperAnswer} />
            <WhisperAnswerModule />
        </div>
    )
}

export default WhisperAnswer

export const getServerSideProps: GetServerSideProps = async context => {
    // Fetch data from external API
    const isServer = true
    const careerListRes = await fetchCareerList(isServer)
    const { careerList, status } = careerListRes || {}
    const serverSideData = {
        careerList: status && careerList,
        query: context?.query || {},
    }
    // Pass data to the page via props
    return { props: { serverSideData } }
}
