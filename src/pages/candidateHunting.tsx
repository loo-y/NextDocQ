import type { NextPage, GetServerSideProps } from 'next'
import { useEffect } from 'react'
import HeaderModule from '@/modules/header'
import { navigationEnum } from '@/utils/constants'
import CandidateHuntingModule from '@/modules/candidateHunting'

const CandidateHunting: NextPage<{ serverSideData: any }, any> = ({ serverSideData }: { serverSideData: any }) => {
    return (
        <div>
            <HeaderModule current={navigationEnum.candidateHunting} />
            <CandidateHuntingModule />
        </div>
    )
}

export default CandidateHunting
