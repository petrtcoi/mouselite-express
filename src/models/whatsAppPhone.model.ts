import mongoose from 'mongoose'

type WhatsAppPhoneType = {
    phone: string
} & mongoose.Document

const schema = new mongoose.Schema<WhatsAppPhoneType>({
    phone: { type: String, required: true }
})

const WhatsAppPhone = mongoose.model('WhatsAppPhone', schema)

export default WhatsAppPhone
export type { WhatsAppPhoneType }