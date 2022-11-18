import mongoose from "mongoose"

import { ProjectType } from './project.models'
import Room, { RoomType } from "./room.model"

type VersionType = {
    title: string
    description?: string
    images?: string
    project: (ProjectType & mongoose.Document)['_id']
    rooms?: (RoomType & mongoose.Document)[]
}


type VersionInput = {
    title?: VersionType['title']
    description?: VersionType['description']
    images?: VersionType['images']
    project: VersionType['project']
}


const schema = new mongoose.Schema<VersionType>({
    title: {
        type: String,
        required: true,
        default: 'Версия'
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    images: {
        type: String,
        required: false,
        default: ''
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project'
    }
}, {
    timestamps: true,
    versionKey: false
})


schema.virtual('rooms', {
    ref: Room,
    localField: '_id',
    foreignField: 'version'
})


schema.post('save', async function (res, next) {
    // const RoomModel = this.model('Room')
    const rooms = await Room.find({ version: res._id })
    if (rooms.length === 0) {
        try {
            const newRoom = new Room({ version: res._id, type: 'zero' })
            await newRoom.save()
        }
        catch (err) { console.log(err) }
    }
    next()
})
schema.post('findOneAndDelete', async function (res, next) {
    const rooms = await Room.find({ version: res._id })
    await Promise.all(rooms.map(room =>
        Room.findOneAndDelete({ _id: room._id })
    ))
    next()
})


const Version = mongoose.model('Version', schema)

export default Version
export type { VersionType, VersionInput }