const { Socket } = require('engine.io-client')

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
        super.onOpen();
        this.emit('join','/');
    }

}

module.exports = WXSocket;