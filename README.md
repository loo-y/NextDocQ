## NextQchat
该项目仅用于学习和交流，基于 NextJS + tailwindcss。
该项目作用为伪装成面试者在视频面试中回答面试官的问题。
通过 Azure STT 获取面试官提问，并通过 Azure Openai来检索问题的答案。 
<br>

<br>
使用 API：
|API|作用|备注|
|--|--|--|
|Azure Openai|回答面试官的提问|--|
|Azure Real-time Speech-to-text|实时监听麦克风获取面试官的语音提问，并转为文本|--|
|upstash Redis|用于保存当前对话的上下文，以及访问者每次面试的记录|--|
  
初次使用，需要创建一个.env 文件，并且将 .env.example 内示例环境变量拷贝至 .env 并填入自己真实的API Key

```bash
mv .env.example .env
```

启动项目
```bash
npm run dev
```

访问 http://localhost:3000/whisperAnswer
通过 Azure Speech To Text 实现实时麦克风监听，设置3秒为当前语音断句间隔，并将此次转成的文本通过 gpt-35-turbo API得到回答。完成面试。


##

### AI菜鸡互助小组
<img src="/public/images/wechat_group.jpg" alt="wechat group" width="200px" height="200px">
