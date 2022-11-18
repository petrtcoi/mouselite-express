import { Request, Response } from "express"

import ItemRadiator, { ItemRadiatorInput } from "../../models/itemRadiator.model"
import Room from "../../models/room.model"
import ProductModel from '../../models/products/productModel.models'
import ProductColor from "../../models/products/productColor.models"
import ProductConnection from "../../models/products/productConnection.models"



const itemRadiartorCreate = async (req: Request, res: Response): Promise<void> => {


    const room = await Room.findOne({ _id: req.body.roomId })
    if (!room) {
        res.status(400).send({error: 'room_cant_find'})
        return
    }
    const model = await ProductModel.findOne({ _id: req.body.modelId })
    if (!model) {
        res.status(400).send({error: 'model_cant_find'})
        return
    }
    if (req.body.colorId) {
        const color = await ProductColor.findOne({ _id: req.body.colorId })
        if (!color) {
            res.status(400).send({error: 'color_cant_find'})
            return
        }
        if (model.colorGroup !== color.group) {
            res.status(400).send({error: 'wrong_color_group'})
            return
        }
    }
    if (req.body.connectionId) {
        const connection = await ProductConnection.findOne({ _id: req.body.connectionId })
        if (!connection) {
            res.status(400).send({error: 'connection_cant_find'})
            return
        }
        if (model.connectionGroup !== connection.group) {
            res.status(400).send({error: 'wrong_connection_group'})
            return
        }
    }



    try {
        const data: ItemRadiatorInput = req.body

        const newItemRadiator = new ItemRadiator({
            room: data.roomId,
            model: data.modelId,
            color: data.colorId,
            connection: data.connectionId,
            sections: data.sections,
            quantity: data.quantity,
            discount: data.discount,
            comment: data.comment
        })
        await newItemRadiator.save()
        res.status(200).send({ itemRadiator: newItemRadiator })
    } catch (err: any) {
        if (err.code && err.code === 11000) {
            res.status(400).send({error: 'validation_error'})
            return
        }
        res.status(500).send({error: 'project_cant_find'})
        return
    }
}


export default itemRadiartorCreate