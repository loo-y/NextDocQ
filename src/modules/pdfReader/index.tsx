import React, { useEffect, useState, useCallback } from 'react'
import _ from 'lodash'
import { Document, Page, pdfjs } from 'react-pdf' //'react-pdf';

// 设置 PDF.js 的 workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = '/api/pdf.worker'

const PdfReader = () => {
    const [file, setFile] = useState(null)
    const [fileLoadStatus, setFileLoadStatus] = useState(0)

    const onFileChange = event => {
        setFileLoadStatus(0)
        const newFile = event?.target?.files[0]
        if (newFile) setFile(newFile)
    }

    const onLoadedSuccess = () => {
        setFileLoadStatus(1)
    }
    return (
        <div id={`pdfreader`}>
            <div className="top_line"></div>
            <FileUploader onChange={onFileChange} />
            {file ? <ControlledCarousel file={file} loadCallback={onLoadedSuccess} /> : null}
        </div>
    )
}

export default PdfReader

const FileUploader = (props: { onChange: (arg: any) => void }) => {
    const { onChange } = props || {}
    return (
        <div className="m-5 w-96">
            <label
                className="block ml-1 mb-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                htmlFor="pdf_uploader_input"
            >
                Choose PDF
            </label>
            <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="user_avatar_help"
                id="pdf_uploader_input"
                type="file"
                onChange={onChange}
            />
        </div>
    )
}
const ControlledCarousel = ({ file, loadCallback }: { file: any; loadCallback?: (arg?: any) => void }) => {
    const [index, setIndex] = useState(0)
    const [numPages, setNumPages] = useState(null)

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex)
    }

    const onDocumentLoadSuccess = documentArgs => {
        console.log(documentArgs)
        const { numPages } = documentArgs || {}
        setNumPages(numPages)
        if (typeof loadCallback == `function`) {
            loadCallback()
        }
    }

    let temp: any = []
    const onPageTextLoadSuccess = page => {
        page.getTextContent().then(textContent => {
            temp.push({
                page: page.pageNumber,
                contentList: textContent?.items,
            })
        })
    }

    return (
        <div>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                {_.map(new Array(numPages), (el, index) => (
                    <div className="inside_carousel" key={`pdf_page_${index}`}>
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            onLoadSuccess={page => onPageTextLoadSuccess(page)}
                        />
                        <p className="pdf_page_number">
                            Page {index + 1} of {numPages}
                        </p>
                        <br />
                    </div>
                ))}
            </Document>
        </div>
    )
}
