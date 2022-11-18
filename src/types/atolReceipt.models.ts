import { AtolPaymentMethod, AtolPaymentObject, AtolPayments } from "./atol.models"
import { MoyskladItemType } from "./moyskaldItemType.models"

export type AtolReceiptType = 'paymentOnly' | 'withDelivery'

export type AtolReceiptItem = {
    id: string
    name: string
    type: MoyskladItemType
    price: number
    quantity: number
    sum: number
    payment_method: AtolPaymentMethod
    payment_object: AtolPaymentObject
}


export type AtolReceipt = {
    items: AtolReceiptItem[]
    payments: AtolPayments
    type: AtolReceiptType
    total: number
}


