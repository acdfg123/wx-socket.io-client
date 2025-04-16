//const  { WebSocket } = require('engine.io-client');
//const WebSocket = require('engine.io-client').WebSocket;
const {WS} = require('engine.io-client/build/cjs/transports/websocket.js');
console.info(`${formatDate()} WebSocket 类型 ${typeof WS} prototype: ${WS.prototype.name}`);
// 生成时间： YYYY-MM-DD HH:mm:ss ssssss
function formatDate() {
    const now = new Date();
  
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} ${String(now.getMilliseconds()).padStart(6,0)}`;
  
}

class wxWebSocket {
    constructor(uri, protocols, opts) {
        //console.info(`${formatDate()} 创建： wxWebSocket protocols:${protocols}  opts:${JSON.stringify(opts)}`);
        this.onopen=() => {};
        this.onmessage=(res) => {};
        this.onclose=(res) => {};
        this.onerror=(res) => {};
        this.write=(parcket)=>{};
        this.packer = (parcket) => {
            console.info(`${formatDate()}  parcket 数据：`, parcket);
            this.write(parcket);
        };
        this.uri = uri;
        this.protocols = protocols;
        this.opts = opts;
        this.connect();
    }

    connect(){
        if(this.socketTask) return;

        this.socketTask = wx.connectSocket({ 
            url: this.uri, 
            protocols: this.protocols,
            ...this.opts });
        this.socketTask.onOpen((res)=> {
            console.info(`${formatDate()}  WebSocket 连接已打开`,res);
            this.onopen(res);
        });
        this.socketTask.onMessage((res)=> {
            console.info(`${formatDate()}  WebSocket 接收到数据`,res);
            this.onmessage(res);
        });
        this.socketTask.onClose((res)=> {
            console.info(`${formatDate()}  WebSocket 连接已关闭！`,res);
            this.onclose(res);
        });
        this.socketTask.onError((res)=> {
            console.info(`${formatDate()}  WebSocket 发生错误：`, res);
            this.onerror(res);
        });
        this.send = (data)=>{
            //打印堆栈
            //console.trace();
            this.socketTask.send(data);
            console.info(`${formatDate()}  WebSocket 发送数据：`, data);
        }
        this.ws = this.socketTask;
    }

    close(){
        if(this.socketTask){
            this.socketTask.close();
        }
    }
}


//把 wx的WebSocket封装成socket.io的WebSocket
class WxWebSocket extends  WS{
    createSocket(uri, protocols, opts) {
        this.ws = new wxWebSocket(uri, protocols, opts);
        this.packer = this.ws.packer;
        this.ws.write = (parcket)=>{
            this.write(parcket);
        };
        return this.ws;
    }

    doWrite(_packet, data) {
        _packet.data = data;
        super.doWrite(_packet, _packet);   
    }
}

module.exports = WxWebSocket;
