import type { NextPage, GetServerSideProps } from 'next'
import { useEffect } from 'react'
import HeaderModule from '@/modules/header'
import { navigationEnum } from '@/utils/constants'

const CandidateHunting: NextPage<{ serverSideData: any }, any> = ({ serverSideData }: { serverSideData: any }) => {
    return (
        <div>
            <HeaderModule current={navigationEnum.candidateHunting} />
        </div>
    )
}

export default CandidateHunting
