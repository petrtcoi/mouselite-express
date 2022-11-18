import { Request, Response } from 'express'
import User from '../../models/user.models'

const getList = async (req: Request, res: Response): Promise<void> => {

    try {
        const users = await User.find({}, { name: 1, id: 1 }).lean()
        res.status(200).send({ userList: users })
        return
    } catch {
        res.status(200).send({ userList: [] })
    }
}

export default getList