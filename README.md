# wx-socket.io-client
微信小程序socket.io客户端，支持 EIO.3,EIO.4

windows系统下在使用 PowerShell 命令：
browserify ./src/wx-socket.io-client.js --standalone createWXSocketIOClient -o dist/wx-socket.io-client.js
生成 wx-socket.io-client.js文件

直接把 wx-socket.io-client.js 拷贝到微信小程序开发目录下，只要是代码目录就行

使用方法：
const connect =require('./wx-socket.io-client.js')
const opts = {
  transports: ['websocket']
  path: '/socket.io',
  query: { EIO: 4 },
  autoConnect : true,
  auth: { token: token }
}
const socket = connect(url,opts)
socket.emit('test','测试文本')
socket.on('test',(data)=>{
	console.info(data)
})

//判断是否已经连接成功
socket.connected
