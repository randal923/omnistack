import express from 'express'
import cors from 'cors'
import mongoose, { connect, connection, connections } from 'mongoose'
import http from 'http';
import routes from './routes/users'
import socketio from 'socket.io'
import { parseStringAsArray } from './utils/parseStringAsArray'
class App {
	private express: express.Application;
	public port: number
	private server: http.Server
    private io: any

	public constructor (port: number) {
		this.express = express()
		this.port = port
		this.middlewares()
		this.database()
		this.routes()
		this.createServer()
	}

	private middlewares (): void {
		this.express.use(express.json())
		this.express.use(cors())
	}

	private database (): void {
		mongoose.connect('mongodb://localhost:27017/omnistack', {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
	}

	private createServer(): void {
		this.server = new http.Server(this.express)
        this.io = socketio(this.server)
	}
	
	private routes (): void {
		this.express.use(routes)
	}

	public listen (): void {
		const connections = []
		this.server.listen('5000', () => {
			console.log(`App running on port 5000`)
		})
		this.io.on('connection', (socket: any) => {
			const {latitude, longitude, techs} = socket.handshake.query
			connections.push({
				id: socket.id,
				coordinates: {
					latitude: Number(latitude),
					longitude: Number(longitude),
				},
				techs: techs
			})
		})
	}
}

export default App