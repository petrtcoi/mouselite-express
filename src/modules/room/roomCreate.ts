import { Request, Response } from "express"

import Version from "../../models/version.model"
import Room from '../../models/room.model'

const roomCreate = async (req: Request, res: Response): Promise<void> => {

    
    const version = await Version.findOne({ _id: req.body.versionId })
    
    if (!version) {
        res.status(400).send({error: 'version_cant_find'})
        return
    }

    const room = {
        version: req.body.versionId,
        title: req.body.title,
        square: req.body.square,
        powerCalculated: req.body.powerCalculated,
        type: 'regular'
    }

    try {
        const newRoom = new Room(room)
        await newRoom.save()
        res.status(200).send({ room: newRoom })
    } catch (err: any) {
        if (err.code && err.code === 11000) {
            res.status(400).send({error: 'validation_error'})
            return
        }
        console.log(err)
        res.status(500).send()
        return
    }

}

export default roomCreate