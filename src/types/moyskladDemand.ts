import { MoyskaldMeta } from './moyskldMeta'


export type MoyskladPosition = {
    quantity: number
    price: number
    discount: number
    vat: number
    assortment: { meta: MoyskaldMeta }
}


export type MoyskladDemand = {
    name: string,
    organization: { meta: MoyskaldMeta }
    agent: { meta: MoyskaldMeta }
    store: { meta: MoyskaldMeta }
    state: { meta: MoyskaldMeta }
    customerOrder: { meta: MoyskaldMeta }
    positions: MoyskladPosition[]
}