import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { findSpecificDir } from '@/utils/serverUtil'

const PdfWorker = async (req: NextApiRequest, res: NextApiResponse) => {
    const rootDir = await findSpecificDir({ startPath: __dirname, specificFile: 'readme.md' })
    const pdfworkerjs = path.resolve(rootDir, './node_modules/pdfjs-dist/build/pdf.worker.js')
    console.log(`pdfworkerjs`, pdfworkerjs)
    console.log(`this is /pdf.worker.js`)
    fs.readFile(pdfworkerjs, (err, data) => {
        if (err) {
            console.log(`fs error`, err)
            res.setHeader('Content-Type', 'text/plain')
            res.status(404)
            res.end('404 Not Found\n')
            return
        }
        res.setHeader('Content-Type', 'application/javascript')
        res.write(data)
        res.end()
    })
}

export default PdfWorker
