import mongoose from 'mongoose'


type CredentialType = {
    key: string
    value: string
}

const schema = new mongoose.Schema<CredentialType>({
    key: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false
})

const Credential = mongoose.model('Credential', schema)

export default Credential
export type { CredentialType }