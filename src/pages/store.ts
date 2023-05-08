import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import chatPDFStore from './chatPDF/model'


  
const rootReducer = combineReducers({
    chatPDFStore: chatPDFStore,
});
const store = createStore(rootReducer, applyMiddleware(thunk));


export default store;