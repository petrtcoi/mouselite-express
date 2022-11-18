import * as DEFAULTS from '../constants/defaults'
import moyskladHttp from './moyskladHttp'
import request from 'supertest'

type CreateOrderProps = {
    name: string,
    items: [
        {
            quantity: number,
            price: number,
            discount: number,
            metaHref: string
        }
    ]
}

type CreateOrderReturn = {
    orderHref?: string
    error?: string
}

const moyskaldCreateOrder = async (props: CreateOrderProps): Promise<CreateOrderReturn> => {

    const last2 = props.name.slice(-2)


    const data = {
        order: last2 === '-0' ? props.name.substring(0, props.name.length - 2) : props.name,
        organization: DEFAULTS.ORGANIZATION,
        agent: DEFAULTS.AGENT,
        positions: props.items.map(item => {
            return {
                quantity: item.quantity,
                price: item.price,
                discount: item.discount,
                vat: 0,
                assortment: {
                    meta: {
                        type: 'product',
                        href: item.metaHref
                    }
                }
            }
        })
    }

    const result = await moyskladHttp.post('/entity/customerorder', data)

    const orderHref = result.data.meta.uuidHref || undefined
    const error = orderHref ? undefined :
        result.data.errors[0].error || 'непонятная ошибка'

    return { orderHref, error }

}

export default moyskaldCreateOrder 