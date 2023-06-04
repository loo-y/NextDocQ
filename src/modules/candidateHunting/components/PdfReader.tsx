import React, { useEffect, useState, useCallback } from 'react'
import _ from 'lodash'
import { Document, Page, pdfjs } from 'react-pdf' //'react-pdf';
import ModalPreview from './ModalPreview'
import {
    LONG_CONTEXT_TYPE,
    InputChangeEvent,
    PdfReaderProps,
    PAGE_CONTENT_TYPE,
    PageContentCollection,
} from '../interface'
import type { DocumentCallback, PageCallback } from 'react-pdf/dist/cjs/shared/types'
import { ArrowUpCircleIcon } from '@heroicons/react/20/solid'
// 设置 PDF.js 的 workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = '/api/pdf.worker'

const PdfReader = (props: PdfReaderProps) => {
    const [file, setFile] = useState<File | null>(null)
    const [fileLoadStatus, setFileLoadStatus] = useState(0)
    const [showPreview, setShowPreview] = useState(false)
    const [showContent, setShowContent] = useState(false)
    const { title = `上传文件`, content, contentEditAction, className } = props || {}

    const onFileChange = (event: InputChangeEvent) => {
        setFileLoadStatus(0)
        const newFile = event?.target?.files[0]
        setShowPreview(true)
        if (newFile) {
            setFile(newFile)
            // 清空content
            contentEditAction('')
        }
    }

    const onLoadedSuccess = () => {
        setFileLoadStatus(1)
    }
    const handlePreviewClose = () => {
        setShowPreview(false)
    }

    return (
        <div className={`${className || ''} pdfreader inline-block relative`}>
            <div className="top_line"></div>
            <FileUploader onChange={onFileChange} title={title} />
            <div className="absolute right-0 top-0">
                {file ? <PDFButton text={`预览`} handleClick={() => setShowPreview(true)} extraClass={''} /> : null}
                {content ? <PDFButton text={`修改`} handleClick={() => setShowContent(true)} /> : null}
            </div>
            {file ? (
                <ModalPreview
                    closeCallback={handlePreviewClose}
                    isOpen={showPreview}
                    title={file.name}
                    children={
                        <ControlledCarousel
                            file={file}
                            loadCallback={onLoadedSuccess}
                            pageCallback={newContent => {
                                !content && contentEditAction(newContent)
                            }}
                        />
                    }
                />
            ) : null}
            {content ? (
                <ModalPreview
                    closeCallback={() => setShowContent(false)}
                    confirmCallback={newContent => {
                        console.log(`newContent`, newContent)
                        contentEditAction(newContent)
                    }}
                    isOpen={showContent}
                    title={`修改内容`}
                    contentEditable={true}
                    children={content}
                    showButton={true}
                />
            ) : null}
        </div>
    )
}

export default PdfReader

const FileUploader = (props: { title?: string; onChange: (arg: any) => void }) => {
    const { onChange, title } = props || {}
    return (
        <div className="my-1 w-full inline-block">
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
                accept="application/pdf"
            />
        </div>
    )
}
const ControlledCarousel = ({
    file,
    pageCallback,
    loadCallback,
}: {
    file: any
    pageCallback?: (arg?: any) => void
    loadCallback?: (arg?: any) => void
}) => {
    const [numPages, setNumPages] = useState(0)

    const onDocumentLoadSuccess = (documentArgs: DocumentCallback) => {
        console.log(`onDocumentLoadSuccess`, documentArgs)
        const { numPages } = documentArgs || {}
        setNumPages(numPages)
        if (typeof loadCallback == `function`) {
            loadCallback()
        }
    }

    let tempCollection: PageContentCollection = []
    const onPageTextLoadSuccess = (page: PageCallback) => {
        page.getTextContent().then(textContent => {
            tempCollection.push({
                page: page.pageNumber,
                contentList: textContent?.items,
            })
            console.log(`onPageTextLoadSuccess`, textContent)
            if (tempCollection.length >= numPages && numPages > 0) {
                console.log(`page Load Success`)
                const longContentBlock = getLongContentFromPage(tempCollection)
                console.log(`longContent`, longContentBlock)
                const { longParagraph } = longContentBlock
                if (longParagraph && typeof pageCallback == `function`) {
                    pageCallback(longParagraph)
                }
            }
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

const PDFButton = ({
    text,
    handleClick,
    extraClass,
}: {
    text: string
    extraClass?: string
    handleClick?: (arg?: any) => void
}) => {
    return (
        <button
            type="button"
            className={`${
                extraClass || ''
            } min-w-[3rem] inline-flex w-full justify-center rounded-md bg-zinc-700 px-0 py-1 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 sm:ml-3 sm:w-auto`}
            onClick={() => {
                if (handleClick) {
                    handleClick()
                }
            }}
        >
            {text}
        </button>
    )
}

const getLongContentFromPage = (pageContentCollection: PageContentCollection) => {
    const endRegs = /[\.\!！。]/
    let longContextList: Array<LONG_CONTEXT_TYPE> = []
    _.map(pageContentCollection, pageContent => {
        const { page, contentList } = pageContent || {}
        let longContext: LONG_CONTEXT_TYPE = {
            page,
            textlines: [],
        }
        let thisLine = '',
            lastTransformString = ''
        _.map(contentList, (content, contentIndex: number) => {
            const { transform, str } = content || {}
            const sameLineTrans = transform
                .slice(0, 4)
                .concat([transform[transform.length - 1]])
                .join(',')
            if (!lastTransformString || sameLineTrans == lastTransformString) {
                thisLine += str
                if (contentIndex == contentList.length - 1) {
                    longContext.textlines.push(thisLine)
                }
            } else {
                longContext.textlines.push(thisLine)
                thisLine = str
            }
            lastTransformString = sameLineTrans
        })

        longContextList.push({
            ...longContext,
        })
    })

    // sort by page number
    longContextList = _.sortBy(longContextList, ['page'])

    // get sentence list
    let sentence = '',
        longParagraph = '',
        flattenSentenceList: any = []
    _.map(longContextList, longContext => {
        const { textlines, page } = longContext || {}
        _.map(textlines, (textline, lineIndex) => {
            const is_end_index = textline.match(endRegs)?.index || -1
            if (is_end_index >= 0) {
                // TODO 根据段落来分隔更好
                const endSentence = sentence + textline.slice(0, is_end_index + 1)
                flattenSentenceList.push({
                    sentence: endSentence,
                })
                longParagraph += `\n${endSentence}`
                sentence = textline.slice(is_end_index + 1)
            } else {
                sentence += textline
            }
        })
    })

    console.log(`flattenSentenceList`, flattenSentenceList)
    return { longContextList, flattenSentenceList, longParagraph }
}
