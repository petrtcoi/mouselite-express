import { Request, Response } from 'express'
import Project from '../../models/project.models'
import Room from '../../models/room.model'
import Version from '../../models/version.model'
import getUniqName from './utils/getUniqName'
import moyskladHttp from './utils/moyskladHttp'

import itemsListFromRooms from './utils/itemsListFromRooms'

import getRoomItemPriceX100 from './utils/getRoomItemPriceX100'
import getMoyskaldItemName from './utils/getMoyskaldItemName'
import getMoyskladItemHref from './utils/getMoyskladItemHref'
import moyskaldProductCreate from './utils/moyskladProductCreate'
import { RoomItemWithMeta } from './types/roomItemWithMeta.type'
import MoyskladItemHref from './models/moyskladItemHref.model'

import * as DEFAULTS from './constants/defaults'


const createOrder = async (req: Request, res: Response): Promise<void> => {
    // console.log(req.body)
    const { versionId } = req.body
    const version = await Version.findOne({ _id: versionId })
    if (!version) { res.status(400).send('cant find version'); return }
    const project = await Project.findOne({ _id: version.project })
    if (!project) { res.status(400).send('cant find project'); return }

    let name = await getUniqName('customerorder', project.title, 0)

    const rooms = await Room.find({ version: versionId }).populate(['itemAccessories', 'itemRadiators']).lean()
    if (!rooms || rooms.length === 0) { res.status(400).send('no rooms'); return }
    // @ts-ignore
    const roomItems = itemsListFromRooms(rooms)

    let items: RoomItemWithMeta[] = []

    // console.log(roomItems)
    for (const roomItem of roomItems) {
        // console.log('roomItem: ', roomItem.accessory)
        let itemHref = await getMoyskladItemHref(roomItem)
        // console.log('itemHref: ', itemHref)

        // проверяем,не устарела ли запись
        if (itemHref !== null) {
            const checkProduct = await moyskladHttp.get(itemHref)
            if (checkProduct.status !== 200 || checkProduct.data.archived === true) {
                itemHref = null
            }
        }


        if (itemHref === null) {
            const newItemName = await getMoyskaldItemName({ item: roomItem })
            if (newItemName !== null) {
                const newProd = await moyskaldProductCreate({ name: newItemName })
                if (newProd) {
                    itemHref = newProd.href
                    await MoyskladItemHref.findOneAndUpdate(
                        { accessory: roomItem.accessory, model: roomItem.model, color: roomItem.color, connection: roomItem.connection, sections: roomItem.sections },
                        { moyskladHref: itemHref },
                        { upsert: true }
                    )
                }
            }
        }
        if (itemHref !== null) {
            const price = await getRoomItemPriceX100({
                item: roomItem,
                currencies: project.currencies
            })
            items = items.concat({
                ...roomItem,
                price,
                metaHref: itemHref
            })
        }

    }

    const result = await moyskladHttp.post('/entity/customerorder', {
        name,
        organization: DEFAULTS.ORGANIZATION,
        agent: DEFAULTS.AGENT,
        positions: items
            .sort((a, b) => a.accessory == undefined && b.accessory !== undefined ? -1 : 1)
            .map(item => {
                return ({
                    quantity: item.quantity,
                    price: item.price,
                    discount: 0,
                    vat: 0,
                    assortment: {
                        meta: {
                            type: 'product',
                            href: item.metaHref
                        }
                    }
                })
            })
    })




    if (result.status !== 200) {
        res.status(500).send(result.data)
    }
    res.status(200).send(result.data)
}

export default createOrder