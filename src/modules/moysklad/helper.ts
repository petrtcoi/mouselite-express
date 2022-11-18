import { Request, Response } from 'express'
import ProductModel from '../../models/products/productModel.models'
import getMoyskladItemHref from './utils/getMoyskladItemHref'
import moyskladHttp from './utils/moyskladHttp'
import ProductConnection from '../../models/products/productConnection.models'
import ProductColor from '../../models/products/productColor.models'
import getMoyskaldItemName from './utils/getMoyskaldItemName'
import moyskaldProductCreate from './utils/moyskladProductCreate'
import MoyskladItemHref from './models/moyskladItemHref.model'


const group = 'zehnder_charleston'
const modelCodes = ['2030', '3030', '2037', '3037', '2050', '3050', '2056', '3057']
// const modelCodes = ['31800', '21800']
const colorCodes = ['RAL 9217 matt', 'RAL 9016', '0325 TL']
// const connectionCodes = ['№25 (терм верх)', '№26 (терм ниж)', '№30 боковое 3/4']
const connectionCodes = ['V001 / V002', '№1270 боковое 3/4"']
const sectionsList = [4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40]


const createOrder = async (req: Request, res: Response): Promise<void> => {

    let total = modelCodes.length * colorCodes.length * connectionCodes.length * sectionsList.length
    let added = 0
    let errors = 0

    for (const modelCode of modelCodes) {
        for (const colorCode of colorCodes) {
            for (const connectionCode of connectionCodes) {
                for (const sections of sectionsList) {
                    const [model, connection, color] = await Promise.all([
                        ProductModel.findOne({ group: group, code: modelCode }),
                        ProductConnection.findOne({ group: group, code: connectionCode }),
                        ProductColor.findOne({ group: group, code: colorCode })
                    ])
                    if (!model || !connection || !color) {
                        errors += 1
                        console.log('cant find docs')
                        continue
                    }
                    const newProductName = await getMoyskaldItemName({
                        item: {
                            model: model._id.toString(),
                            connection: connection._id.toString(),
                            color: color._id.toString(),
                            sections: sections
                        }
                    })
                    if (newProductName === null) {
                        errors += 1
                        console.log('some error')
                        continue
                    }
                    const newProd = await moyskaldProductCreate({ name: newProductName })
                    if (newProd) {
                        await MoyskladItemHref.findOneAndUpdate(
                            { model: model._id, color: color._id, connection: connection._id, sections: sections },
                            { moyskladHref: newProd.href },
                            { upsert: true, new: true }
                        )
                        console.log(`added: ${added} of ${total} (errors: ${errors})`)
                        added += 1
                    }

                }
            }
        }
    }

    res.status(200).send({ added, errors })
}

export default createOrder