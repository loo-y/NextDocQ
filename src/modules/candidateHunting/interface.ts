export type LONG_CONTEXT_TYPE = { page: number; textlines: Array<string> }

export interface InputChangeEvent extends InputEvent {
    target: EventTarget & { files: FileList }
}
export type PdfReaderProps = {
    title?: string
    content?: string
    contentEditAction: (arg: any) => void
}

export type PAGE_CONTENT_TYPE = {
    page: number
    contentList: any
}

export type PageContentCollection = PAGE_CONTENT_TYPE[]
