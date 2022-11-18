import mongoose from 'mongoose'
import User, { UserType } from './user.models'
import Store, { StoreType } from './store.model'
import Version, { VersionType } from './version.model'



type ProjectType = {
    title: string
    description: string
    currencies: {
        eur: number
        varmann: number
    }
    images?: string
    manager: UserType['_id']
    store: StoreType['_id']
    versions?: (VersionType & mongoose.Document)[]
}

type ProjectInput = {
    title: ProjectType['title']
}

const schema = new mongoose.Schema<ProjectType>({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    images: {
        type: String,
        required: false
    },
    currencies: {
        eur: { type: Number, required: true },
        varmann: { type: Number, required: true }
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: Store
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    versionKey: false
})

schema.virtual('versions', {
    ref: Version,
    localField: '_id',
    foreignField: 'project'
})

schema.post('save', async function (res, next) {
    const versions = await Version.find({ project: res._id })
    if (versions.length === 0) {
        const newVersion = new Version({ project: res._id })
        await newVersion.save()
    }
    next()
})



const Project = mongoose.model('Project', schema)

export default Project
export type { ProjectType, ProjectInput }