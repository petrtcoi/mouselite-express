export type OzonUpdatePriceItem = {
    offer_id: string
    price: string
    old_price: string
}

export type OzonUpdateStockItem = {
    offer_id: string
    warehouse_id: number
    stock: number
}