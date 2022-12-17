import { Request, Response } from 'express'
import googleSheetRead from '../../utils/googleSheetRead'

import TubogModel from './models/tubogModel.model'
import TubogConnection from './models/tubogConnection.model'

import { TubogCsvConnectionType } from './typescript/types/tubgoCsvConnection.type'
import { TubogCsvModelType } from './typescript/types/tubgoCsvModel.type'
import range from '../../utils/range'


const MIN_SECTIONS = 4

const updateDb = async (_req: Request, res: Response): Promise<void> => {

    const GOOGLE_DOC_ID_MODELS = 'd/1K6PFmnsAklsE-8jORAIhffg8B542FNBjJNKJQ2pwomY/e'
    const GOOGLE_DOC_ID_CONNECTIONS = 'd/1pABKLGYdkAwk56OfK-m6zll7N14hiYf2LlBS4zmZh98/e'

    const csvModels = await googleSheetRead(GOOGLE_DOC_ID_MODELS) as TubogCsvModelType[]
    const csvConnections = await googleSheetRead(GOOGLE_DOC_ID_CONNECTIONS) as TubogCsvConnectionType[]

    await TubogModel.deleteMany()
    await TubogConnection.deleteMany()

    let modelsCount = 0
    let connectionsCount = 0

    for (const csv of csvModels) {
        const [min, max] = csv.inStockSections ? csv.inStockSections.split('-').map(x => +x) : [0, -1]
        const inStockSections = range(min, max, 2)
        const sectionsMax = csv.sectionsMax ? +csv.sectionsMax : 0

        const model = new TubogModel({
            id: csv.id,
            type: csv.type === 'horizont' ? 'horizont' : csv.type === 'medical' ? 'medical' : 'classic',
            code: csv.code.trim(),
            name: csv.name.trim(),
            description: csv.description ? csv.description.trim() : null,
            interAxle: +csv.interAxle,
            width: +csv.width,
            height: +csv.height,
            lengthSection: (csv.lengthSection && +csv.lengthSection > 0) ? +csv.lengthSection : 0,
            lengthBase: (csv.lengthBase && +csv.lengthBase > 0) ? +csv.lengthBase : 0,
            dt70: +csv.dt70,
            dt60: +csv.dt60,
            dt50: +csv.dt50,
            priceBase: csv.priceBase && +csv.priceBase > 0 ? +csv.priceBase : 0,
            priceSection: csv.priceSection && +csv.priceSection > 0 ? +csv.priceSection : 0,
            imageMain: csv.imageMain.trim(),
            imagesList: csv.imagesList && csv.imagesList.length > 0 ? csv.imagesList.split(',').map(img => img.trim()) : [],
            inStock: !!csv.inStock && csv.inStock === 'true',
            colorId: csv.colorId ? csv.colorId.trim() : null,
            connectionId: csv.connectionId ? csv.connectionId.trim() : null,
            inStockSections: inStockSections,
            volume: +csv.volume,
            weightSection: +csv.weightSection,
            sectionsMax: sectionsMax,
            sectionsRange: range(MIN_SECTIONS, sectionsMax, 1)
        })
        await model.save()
        modelsCount += 1
    }

    for (const csv of csvConnections) {
        const connection = new TubogConnection({
            id: csv.id,
            type: csv.type === 'horizont' ? 'horizont' : csv.type === 'medical' ? 'medical' : 'classic',
            code: csv.code,
            name: csv.name,
            thread: csv.thread,
            price: csv.price ? +csv.price : 0,
            image: csv.image.trim()
        })
        await connection.save()
        connectionsCount += 1
    }

    res.status(200).send({models: modelsCount, connections: connectionsCount})


}

export default updateDb