import mongoose from "mongoose"

type Supplier = {
    code: string
    name: string
}

const schema = new mongoose.Schema<Supplier>({
    code: { type: String, required: true },
    name: { type: String, required: true }
})

const Supplier =  mongoose.model('Supplier', schema)

export default Supplier
export type { Supplier }