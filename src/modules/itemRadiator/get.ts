import { Request, Response } from "express"

import ItemRadiator from '../../models/itemRadiator.model'


const get = async (req: Request, res: Response): Promise<void> => {
    try {
        const itemRadiator = await ItemRadiator
            .findOne({ _id: req.params.id })
            .lean()
        res.status(200).send({ itemRadiator })
        return
    } catch {
        res.status(400).send({ error: 'room_cant_item_radiator' })
    }
}

export default get
