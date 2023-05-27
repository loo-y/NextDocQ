// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    now: string
}

const Hello = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const now = new Date()
    await new Promise(resolve => setTimeout(resolve, 3000))
    res.status(200).json({ now: now.toString() })
}

export default Hello
