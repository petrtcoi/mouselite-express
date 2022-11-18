import { Response, Request } from 'express'

import { COLORS_MUAR } from './typescript/constants/colorsMuar'
import { COLORS_RAL } from './typescript/constants/colorsRal'

import connectionNames from './typescript/constants/connectionNames'

import KradModel from './models/kradModel.model'
import KradRadiator from './models/kradRadiator.model'
import montageNames from './typescript/constants/montageNames'
import { KradResponse } from './typescript/types/kradResponse.type'
import { KradModelType } from './models/kradModel.model'
import { ConnectionEnum } from './typescript/enums/connection.enum'
import { MontageEnum } from './typescript/enums/montage.enum'



const COLORS = [...COLORS_RAL, ...COLORS_MUAR]


const get = async (req: Request, res: Response): Promise<void> => {
    try {
        const { url } = req.query
        if (url === undefined || typeof(url) !== 'string') {
            res.status(400).send('no url param as string')
            return
        }
        const [modelName, radiatorName, connectionUrlParam, montageUrlParam, colorId] = url.split('models/')[1].split('/')

        const model = await KradModel.findOne({ name: modelName }) as KradModelType
        const radiator = await KradRadiator.findOne({ modelName: modelName, name: radiatorName })
        const [connectionCode, connection] = Object.entries(connectionNames).find(([code, value]) => value.urlParam === connectionUrlParam) || [null, null]
        const [montageCode, montage] = Object.entries(montageNames).find(([code, value]) => value.urlParam === montageUrlParam) || [null, null]
        const color = COLORS.find(x => x.id === colorId)

        if (!model || !radiator || !connection || !montage || !color) {
            res.status(400).send('cant find radiator')
            return
        }

        let title = `Радиатор КЗТО ${model.title} ${radiator.name} ${connection.name} ${montage.name} ${color.name}`
        if (montageUrlParam === 'w' && radiator.wall_consoles_name) {
            title += `. В комплекте кронштейны: ${radiator.wall_consoles_name}`
        }

        const connectionCost = model[connectionCode as ConnectionEnum] || 0
        const colorRate = color.rate
        const radiatorCost = Math.floor((radiator.price + connectionCost) * colorRate)
        const montageCost = Math.floor((model[montageCode as MontageEnum] || 0) * colorRate)
        const price = radiatorCost + montageCost

        const result: KradResponse = {
            title,
            dt60: radiator.dt60,
            dt70: radiator.dt70,
            height: radiator.height,
            depth: radiator.depth,
            length: radiator.length,
            price
        }


        res.status(200).send(result)
    } catch {
        res.status(500).send('some error')
    }

}

export default get

