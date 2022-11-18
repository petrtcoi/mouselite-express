import mongoose from 'mongoose'

type WhatsAppTemplateType = {
    text: string
} & mongoose.Document

const schema = new mongoose.Schema<WhatsAppTemplateType>({
    text: {
        type: String,
        required: true
    }
})

const WhatsAppTemplate = mongoose.model('WhatsAppTemplate', schema)

export default WhatsAppTemplate
export type { WhatsAppTemplateType }