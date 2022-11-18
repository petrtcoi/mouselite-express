import mongoose from 'mongoose'


type CurrencyType = {
    name: string
    rate: number
}

const schema = new mongoose.Schema<CurrencyType>({
    name: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
})

const Currency = mongoose.model('Currency', schema)

export default Currency
export type { CurrencyType }