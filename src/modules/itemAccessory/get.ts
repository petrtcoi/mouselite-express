import { Request, Response } from "express"

import ItemAccessory from '../../models/itemAccessory.model'


const get = async (req: Request, res: Response): Promise<void> => {


    try {
        const itemAccessory = await ItemAccessory
            .findOne({ _id: req.params.id })
            .lean()
        res.status(200).send({ itemAccessory })
        return
    } catch {
        res.status(400).send({ error: 'room_cant_item_accessory' })
    }
}

export default get
