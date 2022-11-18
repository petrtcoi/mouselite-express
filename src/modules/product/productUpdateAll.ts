import { Request, Response } from "express"
import googleSheetRead from "../../utils/googleSheetRead"

import mongoose from 'mongoose'

import dataAll from './data'


const updateItem = async (model: mongoose.Model<any, {}, {}, {}>, data: { [key: string]: any }): Promise<'ok' | 'error'> => {
    
    try {
        await model.validate(data)
        await model.findOneAndUpdate(
            { group: data.group, code: data.code },
            { ...data },
            {
                upsert: true, context: 'query',
                setDefaultsOnInsert: true
            })
        return 'ok'
    } catch (err) {
        return 'error'
    }
}

const productUpdateAll = async (_req: Request, res: Response): Promise<void> => {

    console.log('start: productUpdateAll')

    let result: { [key: string]: any } = {}

    for (const dataAllSingleType of dataAll) {


        const groupsAll = await googleSheetRead(dataAllSingleType.link)
        const title = dataAllSingleType.title
        result[title] = { errors: false }
        const now = Date.now()

        for (const groupData of groupsAll) {

            const { link, ...groupUpdates } = groupData
            try {
                const data = await googleSheetRead(link)
                await Promise.all(
                    data.map(async (row) => {
                        const res = await updateItem(dataAllSingleType.model, { ...row, ...groupUpdates, lengthBase: row.lengthBase || groupUpdates.lengthBase })
                        if (res === 'error') {
                            result[title].errors = true
                        }
                    })
                )
            } catch (err) {
                console.log('LINK ERROR: ', link)
            }
        }


        result[title].docs_in_db = await dataAllSingleType.model.find({}).countDocuments()
        result[title].new = await dataAllSingleType.model.find({ createdAt: { $gte: now } }).countDocuments()
        result[title].updated = (await dataAllSingleType.model.updateMany({ updatedAt: { $gte: now } }, { deprecated: false })).matchedCount - result[title].new
        result[title].deprecated = (await dataAllSingleType.model.updateMany({ updatedAt: { $lte: now } }, { deprecated: true })).matchedCount
    }


    res.status(200).send(result)


}

export default productUpdateAll
