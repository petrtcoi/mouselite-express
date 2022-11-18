import { Request, Response } from "express"

import ItemRadiator from "../../models/itemRadiator.model"
import ProductModel from '../../models/products/productModel.models'
import ProductColor from "../../models/products/productColor.models"
import ProductConnection from "../../models/products/productConnection.models"



const itemRadiartorUpdate = async (req: Request, res: Response): Promise<void> => {


    const allowUpdates = ['model', 'color', 'connection', 'quantity', 'discount', 'sections', 'comment']
    const updates = Object.fromEntries(
        Object.entries(req.body.updates)
            .filter(([key, _value]) => allowUpdates.includes(key))
    )

    const itemRadiator = ItemRadiator.findOne({ _id: req.body.id })
    if (!itemRadiator) {
        res.status(400).send({ error: 'itemradiator_cant_find' })
        return
    }

    let model = null

    if (updates.model) {
        model = await ProductModel.findOne({ _id: updates.model })
        if (!model) {
            res.status(400).send({ error: 'model_cant_find' })
            return
        }
    }

    if ((updates.color || updates.connection) && !model) {
        model = await ProductModel.findOne({ _id: itemRadiator.model })
        if (!model) {
            res.status(500).send({ error: 'wrong_modelId' })
            return
        }
    }



    if (updates.color) {
        const color = await ProductColor.findOne({ _id: updates.color })
        if (!color) {
            res.status(400).send({ error: 'color_cant_find' })
            return
        }
        if (!model || model.colorGroup !== color.group) {
            res.status(400).send({ error: 'wrong_color_group' })
            return
        }
    }

    if (updates.connection) {
        const connection = await ProductConnection.findOne({ _id: updates.connection })
        if (!connection) {
            res.status(400).send({ error: 'connections_cant_find' })
            return
        }
        if (!model || model.connectionGroup !== connection.group) {
            res.status(400).send({ error: 'wrong_connection_group' })
            return
        }
    }

    try {
        const response = await ItemRadiator.findOneAndUpdate({ _id: req.body.id }, updates, { new: true })
        res.status(200).send({ itemRadiator: response })
        return
    } catch (err) {
        res.status(500).send({ error: '' })
        return
    }
}


export default itemRadiartorUpdate