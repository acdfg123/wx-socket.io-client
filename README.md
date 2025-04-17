# wx-socket.io-client
微信小程序socket.io客户端，支持 EIO.3,EIO.4

可以直接使用 dist 目录下的 wx-socket.io-client.js 文件

也可以根据自己的需求去修改源码

修改前需要在项目目录下执行：npm install

安装完依赖库就可以自行修改

修改完成后需要：

windows系统下在库的根目录使用 PowerShell 命令：

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
