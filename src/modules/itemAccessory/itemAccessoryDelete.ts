import { Request, Response } from "express"

import ItemAccessory from "../../models/itemAccessory.model"




const itemAccessoryDelete = async (req: Request, res: Response): Promise<void> => {

    const itemAccessory = await ItemAccessory.findOne({ _id: req.body.id })
    if (!itemAccessory) {
        res.status(400).send({ error: 'item_cant_find' })
        return
    }

    try {
        const removedItemAccessory = await ItemAccessory.findOneAndDelete({ _id: itemAccessory._id })
        res.status(200).send({ itemAccessory: removedItemAccessory })
        return
    } catch (err) {
        res.status(500).send()
        return
    }
}


export default itemAccessoryDelete