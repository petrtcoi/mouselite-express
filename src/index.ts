import app from './app'
import { UserType } from './models/user.models'

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
