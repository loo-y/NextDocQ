import React, { useEffect, useState, useCallback } from 'react'
import _ from 'lodash'
import { Document, Page, pdfjs } from 'react-pdf' //'react-pdf';
import ModalPreview from './ModalPreview'
import { ChevronDoubleUpIcon } from '@heroicons/react/24/outline'
import { ArrowUpCircleIcon } from '@heroicons/react/20/solid'
// 设置 PDF.js 的 workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = '/api/pdf.worker'

interface InputChangeEvent extends InputEvent {
    target: EventTarget & { files: FileList }
}
type PdfReaderProps = {
    title?: string
    content?: string
    contentEditAction: (arg: any) => void
}
const PdfReader = (props: PdfReaderProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [fileLoadStatus, setFileLoadStatus] = useState(0)
    const [showPreview, setShowPreview] = useState(false)
    const { title = `上传文件` } = props || {}

    const onFileChange = (event: InputChangeEvent) => {
        setFileLoadStatus(0)
        const newFile = event?.target?.files[0]
        setShowPreview(true)
        if (newFile) setFile(newFile)
    }

    const onLoadedSuccess = () => {
        setFileLoadStatus(1)
    }
    const handlePreviewClose = () => {
        setShowPreview(false)
    }
    return (
        <div id={`pdfreader`}>
            <div className="top_line"></div>
            <FileUploader onChange={onFileChange} title={title} />
            <button
                type="button"
                className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                onClick={() => {
                    setShowPreview(true)
                }}
            >
                预览
            </button>
            {file ? (
                <ModalPreview
                    closeCallback={handlePreviewClose}
                    isOpen={showPreview}
                    title={file.name}
                    children={<ControlledCarousel file={file} loadCallback={onLoadedSuccess} />}
                />
            ) : null}
        </div>
    )
}

export default PdfReader

const FileUploader = (props: { title?: string; onChange: (arg: any) => void }) => {
    const { onChange, title } = props || {}
    return (
        <div className="m-5 w-[28rem] inline-block mr-2">
            {title ? (
                <label
                    className="block ml-1 mb-2 text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                    htmlFor="pdf_uploader_input"
                >
                    {title}
                </label>
            ) : null}

            <input
                className="block w-full pr-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
                        <p className="pdf_page_number py-2 mb-2 text-sm align-baseline text-center bg-gray-100">
                            <ArrowUpCircleIcon className="h-5 w-5 text-gray-600 inline-block mr-1 align-bottom" />
                            Page {String(index + 1).padStart(2, '0')} of {numPages}
                            <ArrowUpCircleIcon className="h-5 w-5 text-gray-600 inline-block ml-1 align-bottom" />
                        </p>
                        <br />
                    </div>
                ))}
            </Document>
        </div>
    )
}
