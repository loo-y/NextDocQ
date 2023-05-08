
import React, { Dispatch, } from 'react';
import store from '../store';
export const initialState = {
    count: 0,
    gender: 'male'
};
const name = 'chatPDFStore';

export const UPDATE_COUNT = (playload: number)=> {
    // const state = store.getState().chatPDFStore || {}
    // return {
    //     ...state,
    //     count: payload
    // }
    store.dispatch({
        type: 'UPDATE_COUNT',
        playload,
    })
}

const reducer = (state = initialState, action: {type: string, playload: any})=>{
    const { playload, type } = action || {}
    if(type && playload){
        return {
            ...state,
            ...playload,
        }
    }

    return {
        ...state,
    };
};

export default reducer;