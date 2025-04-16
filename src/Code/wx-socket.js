const { Socket } = require('engine.io-client')
console.info(`SocketWithUpgrade 类型： ${typeof Socket}`)

class WXSocket extends Socket {
    constructor(url, options) {
        super(url, options);

        this.once("handshake",(data)=>{
            if(options.auth){
                this.emitReserved('join',{data:'/'})
            }
        });
    }
    onOpen() {
        console.info(`WXSocket 连接打开`);
        super.onOpen();
        this.emit('join','/');
        //发送验证头 handshake 数据
    }

}

module.exports = WXSocket;