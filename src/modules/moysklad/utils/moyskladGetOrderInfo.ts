import moyskladHttp from './moyskladHttp'
import { MoyskaldOrder, MoyskaldItem } from '../../../types/moyskladOrder'


const moyskladGetOrderInfo = async ({ orderName }: { orderName: string }): Promise<{ order?: MoyskaldOrder, error?: boolean }> => {

    // console.log(`/entity/customerorder?filter=name=${orderName}`)
    const result =
        await moyskladHttp.get(`/entity/customerorder?filter=name=${orderName}`)
        || undefined
    if (!result.data.rows || result.data.rows.length === 0) return { error: true }
    // console.log('hey: ' ,result.data)

    const order = result.data

    const name = order.rows[0].name as string
    const id = order.rows[0].id as string
    const sum = order.rows[0].sum / 100 as number
    const payedSum = order.rows[0].payedSum ? order.rows[0].payedSum / 100 : 0
    const shippedSum = order.rows[0].shippedSum ? order.rows[0].shippedSum / 100 : 0
    const agent = order.rows[0].agent
    const organization = order.rows[0].organization

    
    const positions: any = await moyskladHttp.get(order.rows[0].positions.meta.href)
    const productRows = positions.data.rows
    
    const items: MoyskaldItem[] = await productRows.reduce(async (acc: MoyskaldItem[], row: any) => {
        const data = await acc
        const res = await moyskladHttp.get(row.assortment.meta.href)
        const newItem: MoyskaldItem = {
            id: res.data.id,
            type: res.data.meta.type,
            name: res.data.name,
            price: row.price / 100,
            quantity: row.quantity,
            shipped: row.shipped,
            paymentObject: res.data.paymentItemType === 'SERVICE' ? 'service' : 'commodity'
        }
        return [...data, newItem]
    }, [])

    const orderResult = { id, name, agent, organization, sum, payedSum, shippedSum, items }


    return { order: orderResult }
}

export default moyskladGetOrderInfo