const { Manager } = require('socket.io-client');
//const { Socket } = require('engine.io-client')
const WXSocket = require('./wx-socket.js');
const { on } = require('socket.io-client/build/cjs/on.js');
const WxWebSocket  = require('./wx-websocket.engine.js');
console.info(`WXSocket type: ${typeof WXSocket}  WxWebSocket type: ${typeof WxWebSocket}`)

class WXManager extends Manager {
    constructor(url, options) {
        try{
            super(url, {
                transports: ['websocket'],
                forceBase64: true, // Base64 编码
                query: { EIO: 4 },
                autoConnect : true,
                timeout: 20000,
                reconnection: true,
                reconnectionDelay: 15000,
                ...options,
                extraHeaders: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
        }catch(e){
            console.info(`WXManager constructor error ${e}`);
        }
    }

    open(fn){
        try{
            //console.info(`WXManager nsps `,this.nsps);
            if (~this._readyState.indexOf("open"))
                return this;
            //this.engine = new Engine(this.uri, this.opts);
            this.engine = new WXSocket(this.uri,{
                ...this.opts,
                transports:[WxWebSocket]
            });
            const socket = this.engine;
            const self = this;
            this._readyState = "opening";
            this.skipReconnect = false;
            // emit `open`
            const openSubDestroy = on(socket, "open", function () {
                console.info(`WXManager open`);
                self.onopen();
                fn && fn();
            });
            const onError = (err) => {
                this.cleanup();
                this._readyState = "closed";
                this.emitReserved("error", err);
                if (fn) {
                    fn(err);
                }
                else {
                    // Only do this if there is no fn to handle the error
                    this.maybeReconnectOnOpen();
                }
            };
            // emit `error`
            const errorSub = on(socket, "error", onError);
            if (false !== this._timeout) {
                const timeout = this._timeout;
                // set timer
                const timer = this.setTimeoutFn(() => {
                    openSubDestroy();
                    onError(new Error("timeout"));
                    socket.close();
                }, timeout);
                if (this.opts.autoUnref) {
                    timer.unref();
                }
                this.subs.push(() => {
                    this.clearTimeoutFn(timer);
                });
            }
            this.subs.push(openSubDestroy);
            this.subs.push(errorSub);
            super.open(fn);
        }catch(e){
            console.info(`WXManager constructor error ${e}`);
        }
        return this;
    }

    onopen() {
        console.info(`WXManager onopen`);
        super.onopen();
    }
}
module.exports = WXManager;