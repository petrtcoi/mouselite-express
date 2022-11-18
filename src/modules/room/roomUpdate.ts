import { Request, Response } from "express"

import Room from "../../models/room.model"

const roomUpdate = async (req: Request, res: Response): Promise<void> => {

    const room = await Room.findOne({ _id: req.body.id })
    if (!room) {
        res.status(500).send({ error: 'version_cant_find' })
        return
    }

    const allowUpdates = ['title', 'description', 'square', 'powerCalculated']
    const updates = Object.fromEntries(
        Object.entries(req.body.updates)
            .filter(([key, _value]) => allowUpdates.includes(key))
    )


    try {
        const response = await Room.findOneAndUpdate({ _id: req.body.id }, updates, { new: true })
        res.status(200).send({ room: response })
        return
    } catch (err) {
        res.status(500).send()
        return
    }
}

export default roomUpdate