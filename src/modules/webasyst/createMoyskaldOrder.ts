import { Request, Response } from "express"

import waGetOrderData from "./utils/waGetOrderData"
import waGetMoyskladItem from "./utils/waGetMoyskladItems"
import moyskladHttp from "../moysklad/utils/moyskladHttp"
import getUniqName from "../moysklad/utils/getUniqName"

import { WA_STORES } from "./config/waStoresApi.config"
import { WaMoyskaldItem } from './types/waMoyskaldItem.type'

import * as MOYSKLAD_DEFS from '../moysklad/constants/defaults'




const createMoyskladOrder = async (req: Request, res: Response): Promise<void> => {

    const { orderName, waStore } = req.body
    if (waStore !== 'MYOMOIKIRI' && waStore !== 'KITCHENLOVE') {
        res.status(400).send('waStore должен быть MYOMOIKIRI или KITCHENLOVE')
        return
    }
    const WAAPI = waStore === 'MYOMOIKIRI' ? WA_STORES.MYOMOIKIRI : WA_STORES.KITCHENLOVE
    const waOrderItems = await waGetOrderData(orderName, WAAPI)
    if (waOrderItems.length === 0) {
        res.send(400).send('не нашел заказ')
        return
    }

    let orderItems: WaMoyskaldItem[] = []
    for (const waOrderItem of waOrderItems) {
        const moyskladItem = await waGetMoyskladItem(waOrderItem)
        orderItems = orderItems.concat(moyskladItem)
    }

    const newOrderName = await getUniqName('customerorder', orderName.replace('#', ''), 0)
    const result = await moyskladHttp.post('/entity/customerorder', {
        name: newOrderName,
        organization: MOYSKLAD_DEFS.ORGANIZATION,
        agent: MOYSKLAD_DEFS.AGENT,
        positions: orderItems.map(item => {
            return ({
                quantity: item.quantity,
                price: item.price,
                discount: 0,
                vat: 0,
                assortment: {
                    meta: {
                        type: 'product',
                        href: item.moyskladHref
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

export default createMoyskladOrder