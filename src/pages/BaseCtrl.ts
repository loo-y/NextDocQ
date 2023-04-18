import _ from 'lodash'

export default class BaseCtrl {
    [index:string]: any
    Model: any = null
    store: any = null
    actions: any = {}
    constructor() {
        console.log(`baseConstructor`, this.Model)
        // @ts-ignore
        this.Model = this.constructor.Model;
        // @ts-ignore
        this.store = this.constructor.store;
        if(this.Model && this.store){
            const exportNames = Object.keys(this.Model);
            console.log(`constructor`, exportNames)
            let pagAction: {[index: string]: Function} = {}
            _.each(exportNames, (name: string) => {
                const exportObj = this.Model[name];
                console.log(name, exportObj);
                if(name !== `default` && typeof exportObj === `function`){
                    
                    pagAction[name] = (...args: any[])=>{
                        const newState = exportObj(this.store.getState(), ...args);
                        this.store.dispatch({
                            type: name,
                            playload: newState
                        })
                    }
                }
            });
    
            this.actions = {
                ...pagAction
            }
        }
    }
}
