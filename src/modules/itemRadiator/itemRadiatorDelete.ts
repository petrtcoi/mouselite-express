import { Request, Response } from "express"

import ItemRadiator from "../../models/itemRadiator.model"




const itemRadiartorDelete = async (req: Request, res: Response): Promise<void> => {

    const itemRadiator = await ItemRadiator.findOne({ _id: req.body.id })
    if (!itemRadiator) {
        res.status(400).send({error: 'item_cant_find'})
        return
    }

    try {
        const removedItemRadiator = await ItemRadiator.findOneAndDelete({ _id: itemRadiator._id })
        res.status(200).send({  itemRadiator: removedItemRadiator })
        return
    } catch (err) {
        res.status(500).send()
        return
    }
}


export default itemRadiartorDelete