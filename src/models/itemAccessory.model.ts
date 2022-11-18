import mongoose from "mongoose"
import { RoomType } from './room.model'
import { ProductAccessoryType } from "./products/productAccessory.models"



type ItemAccessoryType = {
    room: (RoomType & mongoose.Document)['_id']
    accessory: (ProductAccessoryType & mongoose.Document)['_id']

    quantity: number
    discount: number

    comment?: string
}


type ItemAccessoryInput = {
    roomId: ItemAccessoryType['room']
    accessoryId: ItemAccessoryType['accessory']

    quantity?: ItemAccessoryType['quantity']
    discount?: ItemAccessoryType['discount']

    comment?: ItemAccessoryType['comment']
}


const schema = new mongoose.Schema<ItemAccessoryType>({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    accessory: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ProductAccessory'
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        validate: {
            validator: (value: number) => !value || value >= 0
        }
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    comment: {
        type: String,
        required: false
    }
}, {
    timestamps: false,
    versionKey: false
})

const ItemAccessory = mongoose.model('ItemAccessory', schema)

export default ItemAccessory
export type { ItemAccessoryInput, ItemAccessoryType }