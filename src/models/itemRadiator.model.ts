import mongoose from "mongoose"
import { RoomType } from './room.model'
import { ProductModelType } from "./products/productModel.models"
import { ProductColorType } from "./products/productColor.models"
import { ProductConnectionType } from "./products/productConnection.models"


type ItemRadiatorType = {
    room: (RoomType & mongoose.Document)['_id']
    model: (ProductModelType & mongoose.Document)['_id']
    color?: (ProductColorType & mongoose.Document)['_id']
    connection?: (ProductConnectionType & mongoose.Document)['_id']

    quantity: number
    discount: number
    sections: number

    comment?: string
}


type ItemRadiatorInput = {
    roomId: ItemRadiatorType['room']
    modelId: ItemRadiatorType['model']

    colorId?: ItemRadiatorType['color']
    connectionId?: ItemRadiatorType['connection']

    quantity?: ItemRadiatorType['quantity']
    discount?: ItemRadiatorType['discount']
    sections?: ItemRadiatorType['sections']

    comment?: ItemRadiatorType['comment']
}


const schema = new mongoose.Schema<ItemRadiatorType>({
    room: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    model: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'ProductModel'
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'ProductColor'
    },
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'ProductConnection'
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
    sections: {
        type: Number,
        required: false,
        validate: {
            validator: (value: number) => !value || value > 0
        }
    },
    comment: {
        type: String,
        required: false
    }
}, {
    timestamps: false,
    versionKey: false
})

const ItemRadiator = mongoose.model('ItemRadiator', schema)

export default ItemRadiator
export type { ItemRadiatorInput, ItemRadiatorType }