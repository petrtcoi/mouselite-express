import mongoose from 'mongoose'


type AtolUuidType = {
    orderName: string
    externalId: string
    uuid: string
}

const schema = new mongoose.Schema<AtolUuidType>({
    orderName: {
        type: String,
        required: true,
    },
    externalId: {
        type: String,
        required: true,
    },
    uuid: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false
})

const AtolUuid = mongoose.model('AtolUuid', schema)

export default AtolUuid
export type { AtolUuidType }