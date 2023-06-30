import {mouseliteConfig} from "../config/atol.config"
import { AtolPaymentMethod, AtolPaymentObject, AtolPayments } from "./atol.models"
import { AtolClient } from "./atolClient.models"



export type AtolDocItem = {
    name: string
    price: number
    quantity: number
    sum: number
    payment_method: AtolPaymentMethod
    payment_object: AtolPaymentObject
    vat: { type: "none" }
}


export type AtolDoc = {
    external_id: string
    receipt: {
        client: AtolClient
        company: typeof mouseliteConfig.companyDoc
        items: AtolDocItem[],
        payments: AtolPayments
        total: number
    },
    timestamp: string
}