 import WS from 'engine.io-client/lib/transports/websocket'

var WebSocketImpl = WebSocket; // eslint-disable-line no-undef

WS.prototype.doOpen = function() {
  if (!this.check()) {
    // let probe timeout
    return;
  }

  var uri = this.uri();
  var protocols = this.protocols;
  var opts = {};

  if (this.extraHeaders) {
    opts.headers = this.extraHeaders;
  }
  if (this.localAddress) {
    opts.localAddress = this.localAddress;
  }

  try {
    this.ws = new WebSocketImpl(uri, protocols, opts);
  } catch (err) {
    return this.emit('error', err);
  }
};