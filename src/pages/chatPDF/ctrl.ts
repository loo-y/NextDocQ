import BaseCtrl from "../BaseCtrl"
import * as actions from "./model"
import store from '../store'
class ChatPDFController extends BaseCtrl {
    // Model = Model
    // store = store
    constructor() {
        super()
    }
    handleUpdateCount = ()=>{
        actions.UPDATE_COUNT(1)
    }
};

export default ChatPDFController