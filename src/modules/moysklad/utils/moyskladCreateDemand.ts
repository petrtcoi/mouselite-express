import moyskladHttp from './moyskladHttp'
import { MoyskaldOrder } from "../../../types/moyskladOrder"
import getUniqName from './getUniqName'

import { storeMeta, demandState, baseUrl } from '../../../config/moySklad'
import { MoyskladDemand, MoyskladPosition } from '../../../types/moyskladDemand'


type Props = {
    order: MoyskaldOrder
    items: { id: string, quantity: number }[]
}
type Result = {
    demandLink: string
}

const moySkladCreateDemand = async ({ order, items }: Props): Promise<{ result?: Result, error?: string }> => {

    let totalResult: Result = {
        demandLink: '',
    }

    const positions: (MoyskladPosition | null)[] = items.map(item => {
        const orderItem = order.items.find(x => x.id === item.id)

        if (!orderItem)
            return null

        return {
            price: orderItem.price * 100,
            quantity: item.quantity,
            discount: 0,
            vat: 0,
            assortment: {
                meta: {
                    href: `${baseUrl}/entity/${orderItem.type}/${item.id}`,
                    type: orderItem.type,
                    mediaType: "application/json"
                }
            }

        }
    }).filter(x => x !== null) as unknown as MoyskladPosition[]

    if (positions.length !== items.length) {
        throw new Error('Указан не существующий в заказе товар ID')
    }

    try {

        const demandName = await getUniqName('demand', `a_${order.name}`, 1)

        const demand: MoyskladDemand = {
            name: demandName,
            organization: order.organization,
            agent: order.agent,
            store: storeMeta,
            customerOrder: {
                meta: {
                    href: `${baseUrl}/entity/customerorder/${order.id}`,
                    type: 'customerorder',
                    mediaType: 'application/json',
                }
            },
            state: demandState,
            positions: positions.filter(p => p?.quantity &&  p.quantity > 0) as MoyskladPosition[]
        }


        const result = await moyskladHttp.post('/entity/demand', demand)
        // console.log('result: ', result.data)
        totalResult['demandLink'] = result.data.meta.uuidHref || ''

        return { result: totalResult }


    } catch (err) {
        console.log('err: ', err)
        if (typeof err === "string") {
            return { error: err }
        } else if (err instanceof Error) {
            return { error: err.message }
        } else {
            return { error: 'some docs errors' }
        }
    }


}

export default moySkladCreateDemand