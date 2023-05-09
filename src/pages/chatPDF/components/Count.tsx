import React from 'react'
import { useSelector } from 'react-redux'
import store from '../../store'

const Count = () => {
    const pageStore = store.getState()
    // const count = pageStore.chatPDFStore.count;
    const count = useSelector((state: any) => {
        return state?.chatPDFStore.count
    })

    return <span>{count}</span>
}

export default Count
