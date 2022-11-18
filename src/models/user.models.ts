import mongoose from 'mongoose'


type UserType = {
    name: string
    emails: string[]
    tokens: string[]
} & mongoose.Document

const schema = new mongoose.Schema<UserType>({
    name: {
        type: String,
        required: true,
    },
    emails: {
        type: [{
            type: String
        }],
        required: true
    },
    tokens: {
        type: [{
            type: String
        }],
        required: true
    }
})

const User = mongoose.model('User', schema)

export default User
export type { UserType }