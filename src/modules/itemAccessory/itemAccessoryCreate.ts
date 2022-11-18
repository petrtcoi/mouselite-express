import { Request, Response } from "express"

import ItemAccessory, { ItemAccessoryInput } from "../../models/itemAccessory.model"
import Room from "../../models/room.model"
import ProductAccessory from '../../models/products/productAccessory.models'




const itemAccessoryCreate = async (req: Request, res: Response): Promise<void> => {

    const data: ItemAccessoryInput = req.body
    const room = await Room.findOne({ _id: req.body.roomId })
    if (!room) {
        res.status(400).send({error: 'room_cant_find'})
        return
    }
    const accessory = await ProductAccessory.findOne({ _id: data.accessoryId })
    if (!accessory) {
        res.status(400).send({error: 'accessory_cant_find'})
        return
    }

    

    try {
        const newItemAccessory = new ItemAccessory({
            room: data.roomId,
            accessory: data.accessoryId,
            quantity: data.quantity,
            discount: data.discount,
            comment: data.comment
        })
        await newItemAccessory.save()
        res.status(200).send({ itemAccessory: newItemAccessory })
    } catch (err: any) {
        console.log(err)
        if (err.code && err.code === 11000) {
            res.status(400).send('validation error')
            return
        }
        res.status(500).send('cant create new ItemAccessory')
        return
    }
}


export default itemAccessoryCreate