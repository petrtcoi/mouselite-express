import { Request, Response } from "express"

import Room from '../../models/room.model'


const get = async (req: Request, res: Response): Promise<void> => {

    if (!req.params.id) {
        res.status(400).send({ error: 'no_roomId' })
    }

    try {
        const room = await Room
            .findOne({ _id: req.params.id })
            .populate('itemRadiators', { _id: 1 })
            .populate('itemAccessories', { _id: 1 })
            .lean()
        res.status(200).send({ room })
        return
    } catch {
        res.status(400).send({ error: 'room_cant_find' })
    }
}

export default get
