import { Request, Response } from "express"

import ItemAccessory from "../../models/itemAccessory.model"
import ProductAccessory from '../../models/products/productAccessory.models'




const itemAccessoryUpdate = async (req: Request, res: Response): Promise<void> => {


    const allowUpdates = ['accessory', 'quantity', 'discount', 'comment']
    const updates = Object.fromEntries(
        Object.entries(req.body.updates)
            .filter(([key, _value]) => allowUpdates.includes(key))
    )

    const itemAccessory = ItemAccessory.findOne({ _id: req.body.id })
    if (!itemAccessory) {
        res.status(400).send({ error: 'itemaccessory_cant_find' })
        return
    }

    let model = null

    if (updates.accessory) {
        model = await ProductAccessory.findOne({ _id: updates.accessory })
        if (!model) {
            res.status(400).send({ error: 'model_cant_find' })
            return
        }
    }


    try {
        const response = await ItemAccessory.findOneAndUpdate({ _id: req.body.id }, updates, { new: true })
        res.status(200).send({ itemAccessory: response })
        return
    } catch (err) {
        res.status(500).send('err')
        return
    }
}


export default itemAccessoryUpdate