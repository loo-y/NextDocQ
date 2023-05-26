// get career list from database
// if a career is not in the database, not permitted to access

import type { NextApiRequest, NextApiResponse } from 'next'
import { RedisGet } from './redis/[action]'
import _ from 'lodash'

const CareerList = async (req: NextApiRequest, res: NextApiResponse) => {
    const careerList = await getCareerList()

    return res.status(200).json({ careerList })
}

export default CareerList

const getCareerList = async () => {
    let careerList: any[] = []
    try {
        careerList = await RedisGet(`careerList`)
    } catch (e) {}

    if (_.isEmpty(careerList)) return defaultCareerList

    return careerList
}

export const checkCareer = async (careerId: string) => {
    if (!careerId) return false
    const careerList = await getCareerList()
    const career = _.find(careerList, { id: careerId })
    return career?.text || false
}

const defaultCareerList: any[] = [
    {
        name: `前端开发工程师`,
        text: `front end web developer`,
        id: `front-end-developer`,
    },
    {
        name: `后端开发工程师`,
        text: `back end web developer`,
        id: `back-end-developer`,
    },
    {
        name: `UI设计师`,
        text: `UI designer`,
        id: `ui-designer`,
    },
]
