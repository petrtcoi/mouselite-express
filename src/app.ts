import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import path from 'path'

import bodyParser from 'body-parser'

import router from './routers/router'

// import getMongoUrl from './config/mongodb.config'

// dotenv.config({ path: path.join(__dirname, `./config/${process.env.NODE_ENV}.env`) })
// console.log(process.env.NODE_ENV)

dotenv.config()

const mongoDbUrl = process.env.MONGO_URL || ''

const app: Express = express()
app.use(express.json({ limit: '5mb' }))
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)

app.get('/', (req: Request, res: Response) => {
	res.status(200).send('<h1>Hello from the TypeScript world!</h1>')
})

console.log('mongoDbUrl', mongoDbUrl)
mongoose.connect(mongoDbUrl, {
	// bufferCommands: true,
	sslValidate: true,
	// sslCA: path.resolve(path.join(__dirname, `./config/yandex_cloud_mongo_CA.pem`)),
	// autoIndex: false,
})
mongoose.connection.once('open', () => {
	console.log('connected')
	// mongoose.connection.useDb('mouselite')
	app.emit('ready')
})

export default app
