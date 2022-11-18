import mongoose from "mongoose"


export type OmoikiriItemType = {
    sku: string
    group: string
    name: string
    brandName: string
    brandCountry: string
    brandManufacturerCountry: string
    color?: string
    description: string
    price: string
    imageUrl?: string
    schemaUrl?: string
    youtubeUrl?: string
    material?: string
    guarantee?: string
    equipment?: string

    featuresSize: { [key: string]: string }
    featuresTransport: { [key: string]: string }
    featuresOther: { [key: string]: string }
    featuresNotSorted: { [key: string]: string }
}

const schema = new mongoose.Schema<OmoikiriItemType>({
    sku: { type: String, required: true },
    group: { type: String, required: true },
    name: { type: String, required: true },
    brandName: { type: String, required: true },
    brandCountry: { type: String, required: true },
    brandManufacturerCountry: { type: String, required: true },
    color: { type: String, required: false },
    description: { type: String, required: true },
    price: { type: String, required: true },
    imageUrl: { type: String, required: false },
    schemaUrl: { type: String, required: false },
    youtubeUrl: { type: String, required: false },
    material: { type: String, required: false },
    guarantee: { type: String, required: false },
    equipment: { type: String, required: false },


    featuresSize: { type: Object, of: String },
    featuresTransport: { type: Object, of: String },
    featuresOther: { type: Object, of: String },
    featuresNotSorted: { type: Object, of: String }
})

const OmoikiriItem = mongoose.model('OmoikiriItem', schema)

export default OmoikiriItem