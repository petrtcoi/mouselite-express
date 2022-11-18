import { AtolPaymentObject } from "./atol.models"
import { MoyskladItemType } from "./moyskaldItemType.models"

export type MoyskaldItem = {
    id: string
    type: MoyskladItemType
    name: string
    price: number
    quantity: number
    shipped: number
    paymentObject: AtolPaymentObject
}

export type MoyskaldOrder = {
    id: string
    name: string
    agent: any
    organization: any
    sum: number
    payedSum: number
    shippedSum: number
    items: MoyskaldItem[]
}