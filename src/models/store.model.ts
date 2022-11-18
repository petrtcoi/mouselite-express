import mongoose from "mongoose"
import { WhatsAppPhoneType } from './whatsAppPhone.model'
import WhatsAppTemplate, { WhatsAppTemplateType } from './whatsAppTemplate.model'

require('./whatsAppPhone.model')
require('./whatsAppTemplate.model')

type StoreType = {
    code: string
    name: string
    logoUrl: string
    offerUrlBase?: string
    website?: string
    phones?: string[]
    email?: string
    whatsappPhone: WhatsAppPhoneType
    whatsappTemplates: WhatsAppTemplateType[]
} & mongoose.Document

const schema = new mongoose.Schema<StoreType>({
    code: { type: String, required: true },
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
    offerUrlBase: { type: String, required: false },
    website: { type: String, required: false },
    email: { type: String, required: false },
    phones: [{ type: String, required: false }],
    whatsappPhone: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'WhatsAppPhone'
    },
    whatsappTemplates: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: WhatsAppTemplate
        }
    ]
})

const Store = mongoose.model('Store', schema)

export default Store
export type { StoreType }