import HeaderModule from '@/modules/header'
import AboutModule from '../modules/about/about'
import type { NextPage } from 'next'
import { navigationEnum } from '@/utils/constants'

const About: NextPage = () => {
    return (
        <div>
            <HeaderModule current={navigationEnum.about} />
            <AboutModule />
        </div>
    )
}

export default About
