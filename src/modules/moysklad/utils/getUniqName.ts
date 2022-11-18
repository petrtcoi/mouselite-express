import mongoose from "mongoose"
import moyskladHttp from "./moyskladHttp"

const isNameUniq = async ({ object, name }: { object: string, name: string }): Promise<boolean> => {
    const result = await moyskladHttp.get(`/entity/${object}?filter=name=${name}`)
    return result.data.rows.length === 0
}
const getUniqName = async (object: string, base: string, index: number): Promise<string> => {

    const checkName = `${base}-${index}`
    const isUniq = await isNameUniq({ object: object, name: checkName })
    if (isUniq) return checkName
    if (index >= 9) return `${base}-${new mongoose.Types.ObjectId().toString()}`
    return await getUniqName(object, base, index + 1)
}

export default getUniqName