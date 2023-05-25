import { AnyObj, InterviewParams } from './interface'
import Cookie from 'universal-cookie'

const commonOptions = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
}

export const fetchCount = async (amount = 1): Promise<{ data: number }> => {
    const response = await fetch('/api/counter', {
        ...commonOptions,
        body: JSON.stringify({ amount }),
    })
    const result = await response.json()

    return result
}

export const fetchInterviewAnswer = async (interviewParams: InterviewParams): Promise<AnyObj> => {
    const params: InterviewParams = {
        ...interviewParams,
    }
    let errorInfo = undefined
    try {
        const response = await fetch('/api/azure/interview', {
            ...commonOptions,
            body: JSON.stringify(params),
        })
        const result = await response.json()
        // const result = interviewResult
        return {
            result,
            status: true,
        }
    } catch (e) {
        console.log(`fetchInterviewAnswer`, { error: e })
        errorInfo = e
    }

    return {
        status: false,
        errorInfo,
    }
}

export const fetchTokenOrRefresh = async () => {
    const cookie = new Cookie()
    const speechTokenCookieName = 'speech-token'
    const speechToken = cookie.get(speechTokenCookieName)

    if (speechToken === undefined) {
        try {
            const response = await fetch('/api/azure/speechcheck', {
                ...commonOptions,
                method: 'GET',
            })
            const result = await response.json()
            const { token, region } = result || {}
            cookie.set(speechTokenCookieName, region + ':' + token, { maxAge: 540, path: '/' })
            console.log('Token fetched from back-end: ' + token)
            return { status: true, authToken: token, region: region }
        } catch (err) {
            return { status: false, authToken: null, errorInfo: err }
        }
    } else {
        console.log('Token fetched from cookie: ' + speechToken)
        const idx = speechToken.indexOf(':')
        return { status: true, authToken: speechToken.slice(idx + 1), region: speechToken.slice(0, idx) }
    }
}

const interviewResult = {
    answer: 'React和普通的DOM操作最大的不同在于它使用了虚拟DOM。在React中，每个组件都有自己的虚拟DOM树，当组件的状态发生变化时，React会重新计算虚拟DOM树的差异，并将差异应用到实际的DOM树上，从而更新UI。\n\n这种方式相',
    memoryChatKey: '11223344',
    memoryMessags: [
        {
            ai: '是的，我知道TS，它是TypeScript的缩写。TypeScript是一种由微软开发的开源编程语言，它是JavaScript的超集，可以在编写JavaScript代码时提供更好的类型检查和代码提示。TypeScript还支持ES6和ES7的新特性，并且可以编译成纯JavaScript代码，可以在任何支持JavaScript的平台',
            human: '你知道ts吗',
            timestamp: 1685044097464,
        },
        {
            ai: 'TypeScript和JavaScript的最大区别在于类型系统。TypeScript是一种静态类型语言，它可以在编译时检查类型错误，而JavaScript是一种动态类型语言，只有在运行时才能检查类型错误。这意味着在使用TypeScript时，开发者可以更早地发现和修复类型错误，从而减少代码中的',
            human: '它和js有什么区别',
            timestamp: 1685044122985,
        },
        {
            ai: 'React是一个由Facebook开发的JavaScript库，用于构建用户界面。它采用了组件化的开发模式，将UI拆分成独立的组件，每个组件都有自己的状态和生命周期方法。React还使用虚拟DOM来提高性能，它可以在内存中维护一个虚拟的DOM树，通过',
            human: '那react呢',
            timestamp: 1685044168058,
        },
        {
            ai: "当然可以，以下是一个简单的React组件的代码示例：\n\n```jsx\nimport React from 'react';\n\nclass MyComponent extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = {\n      count: 0\n    };\n  }\n\n  handleClick = () => {\n    this.setState({ count: this.state.count + 1 });\n  }\n\n  render() {\n    return (\n      <div>\n        <h1>My Component</h1",
            human: '可以给我一个简单的代码例子吗',
            timestamp: 1685044189669,
        },
        {
            ai: 'React和普通的DOM操作最大的不同在于它使用了虚拟DOM。在React中，每个组件都有自己的虚拟DOM树，当组件的状态发生变化时，React会重新计算虚拟DOM树的差异，并将差异应用到实际的DOM树上，从而更新UI。\n\n这种方式相',
            human: '说说他和普通的dom操作有什么不一样',
            timestamp: 1685044214751,
        },
    ],
}
