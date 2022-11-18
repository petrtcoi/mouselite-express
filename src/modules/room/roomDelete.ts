import { Request, Response } from "express"

import Room from "../../models/room.model"




const roomDelete = async (req: Request, res: Response): Promise<void> => {
    const room = await Room.findOne({ _id: req.body.id })
    if (!room) {
        res.status(400).send({error: 'room_cant_find'})
        return
    }
    if (room.type === 'zero') {
        res.status(406).send('cant_delete_room_zero')
        return
    }

    try {
        await Room.findOneAndDelete({ _id: room._id })
        res.status(200).send({ room: room })
        return
    } catch (err) {
        res.status(500).send()
        return
    }

}

export default roomDelete
