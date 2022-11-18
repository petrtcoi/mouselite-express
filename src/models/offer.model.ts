import mongoose from "mongoose"
import { ProjectType } from "./project.models"

type OfferType = {
    jsonString: string
    project: (ProjectType & mongoose.Document)['_id']
}
type OfferInput = {
    jsonString: OfferType['jsonString']
    project: OfferType['project']
}

const schema = new mongoose.Schema<OfferType>({
    jsonString: {
        type: String,
        required: true
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

const Offer = mongoose.model('Offer', schema)

export default Offer
export type { OfferType, OfferInput }