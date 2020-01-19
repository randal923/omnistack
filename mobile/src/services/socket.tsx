import io from 'socket.io-client';

const socket = io('http://localhost:5000')

function connect(latitude: number, longitude: number, techs: string) {
    socket.io.opts.query = {latitude, longitude, techs}
    socket.connect()
    console.log(socket.connected)
}

function disconnect() {
    if(socket.connected) {
        socket.disconnect()
    }
}

export {connect, disconnect}