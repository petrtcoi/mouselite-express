import { Request, Response } from "express"
import getGoogleSheetData from "../../utils/getGoogleSheetData"

import { DOC_ID, SHEET_ID_LIST } from "./constants/googleSheetData"
import { SIZE_FEATURES, TRANSPORT_FEATURES, OTHER_FEATURES, GENERAL_FEATURES } from "./constants/features"
import OmoikiriItem, { OmoikiriItemType } from './models/omoikiriItem.model'


const omoikiriParseGoogle = async (_req: Request, res: Response): Promise<void> => {

    let csvData: { [key: string]: string }[] = []
    for (const sheetId of SHEET_ID_LIST) {
        const sheetData = await getGoogleSheetData(DOC_ID, sheetId)
        csvData = [...csvData, ...sheetData]
    }

    const csvItems: OmoikiriItemType[] = []
    csvData.forEach(item => {
        const csvItem: OmoikiriItemType = {
            sku: item['артикул'],
            group: item['товарная группа'].replace(/ /g,'-'),
            name: item['наименование'],
            brandName: item['бренд'],
            brandCountry: item['страна бренда'],
            brandManufacturerCountry: item['страна производства'],
            color: item['цвет'],
            description: item['описание'],
            price: item['ррц'].replace(/ /g,'').replace(/ /g, ''),
            imageUrl: item['фото'],
            schemaUrl: item['схема'],
            youtubeUrl: item['ролики'],
            material: item['материал'],
            guarantee: item['гарантия'],
            equipment: item['Комплектация'],

            featuresSize: {},
            featuresTransport: {},
            featuresOther: {},
            featuresNotSorted: {}
        }

        Object.entries(item).forEach(([key, value]) => {
            let flag = false
            if (key in SIZE_FEATURES) { csvItem.featuresSize[SIZE_FEATURES[key]] = value }
            if (key in TRANSPORT_FEATURES) { csvItem.featuresTransport[TRANSPORT_FEATURES[key]] = value }
            if (key in OTHER_FEATURES) { csvItem.featuresOther[OTHER_FEATURES[key]] = value }
            if (
                !(key in SIZE_FEATURES) &&
                !(key in TRANSPORT_FEATURES) &&
                !(key in OTHER_FEATURES) &&
                !((key in GENERAL_FEATURES))
            ) csvItem.featuresNotSorted[key] = value
        })
        csvItems.push(csvItem)
    })


    await OmoikiriItem.deleteMany({})

    for (const csv of csvItems) {
        const dbItem = new OmoikiriItem(csv)
        await dbItem.save()
    }

    res.status(200).send('DONE')

}

export default omoikiriParseGoogle