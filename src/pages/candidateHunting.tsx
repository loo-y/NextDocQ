import type { NextPage, GetServerSideProps } from 'next'
import { useEffect } from 'react'
import HeaderModule from '@/modules/header'
import { navigationEnum } from '@/utils/constants'
import PdfReader from '@/modules/pdfReader'

const CandidateHunting: NextPage<{ serverSideData: any }, any> = ({ serverSideData }: { serverSideData: any }) => {
    return (
        <div>
            <HeaderModule current={navigationEnum.candidateHunting} />
            <PdfReader />
        </div>
    )
}

export default CandidateHunting
