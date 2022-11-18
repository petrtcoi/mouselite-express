import mongoose from "mongoose"

import { VersionType } from "./version.model"
import ItemRadiator, { ItemRadiatorType } from './itemRadiator.model'
import ItemAccessory, { ItemAccessoryType } from './itemAccessory.model'



type RoomType = {
    type: 'zero' | 'regular'
    title: string
    description?: string
    square: number
    powerCalculated: number
    version: (VersionType & mongoose.Document)['_id']
    itemRadiators?: (ItemRadiatorType & mongoose.Document)[]
    itemAccessories?: (ItemAccessoryType & mongoose.Document)[]
}


type RoomInput = {
    title: RoomType['title'],
    square: RoomType['square'],
    powerCalculated: RoomType['powerCalculated'],
    version: RoomType['version']
}


const schema = new mongoose.Schema<RoomType>({
    type: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'Помещение'
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    square: {
        type: Number,
        required: true,
        default: 10,
        validate: {
            validator: (value: number) => value >= 0
        }
    },
    powerCalculated: {
        type: Number,
        required: true,
        default: 1000,
        validate: {
            validator: (value: number) => value >= 0
        }
    },
    version: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Version'
    }
}, {
    timestamps: true,
    versionKey: false
})


schema.virtual('itemRadiators', {
    ref: ItemRadiator,
    localField: '_id',
    foreignField: 'room'
})
schema.virtual('itemAccessories', {
    ref: ItemAccessory,
    localField: '_id',
    foreignField: 'room'
})

schema.post('findOneAndDelete', async function (res, next) {
    const itemRadiators = await ItemRadiator.find({ room: res._id })
    await Promise.all(itemRadiators.map(itemRadiator =>
        ItemRadiator.findOneAndDelete({ _id: itemRadiator._id })
    ))
    const itemAccessories = await ItemAccessory.find({ room: res._id })
    await Promise.all(itemAccessories.map(itemAccessory =>
        ItemAccessory.findOneAndDelete({ _id: itemAccessory._id })
    ))
    next()
})



const Room = mongoose.model('Room', schema)

export default Room
export type { RoomType, RoomInput }