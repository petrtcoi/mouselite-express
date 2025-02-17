import app from './app'
import Room from './models/room.model'
import { UserType } from './models/user.models'
import getMoyskaldItemName from './modules/moysklad/utils/getMoyskaldItemName'
import itemsListFromRooms from './modules/moysklad/utils/itemsListFromRooms'

const PORT = process.env.PORT || 3000

declare global {
	namespace Express {
		interface Request {
			user: UserType
		}
	}
}

app.on('ready', () => {
	app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`))
})
