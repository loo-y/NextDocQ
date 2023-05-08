import React from 'react'
import { Provider, useSelector } from 'react-redux';
import store from '../store';
import Ctrl from './ctrl'
import Body from './components/Body'

const ChatPDF = ()=>{
    const handleTest = ()=>{
        // Ctrl.handleUpdateCount()
    }
    return (
        <Provider store={store}>
        <div>
            <Body />
            <h1 onClick={handleTest}>Random User</h1>
        </div>
        </Provider>
    )
}


export default ChatPDF