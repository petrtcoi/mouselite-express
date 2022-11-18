import axios from "axios"
import { WebasystApi } from "../config/waStoresApi.config"
import { WaOrderItem } from "../types/waOrderItem.type"

export const waGetOrderData = async (orderName: string, waApi: WebasystApi): Promise<WaOrderItem[]> => {

    const waAllOrders = await axios.get(`${waApi.WEBSITE}/api.php/shop.order.search?&access_token=${waApi.TOKEN}&format=json`)
    const waOrder = waAllOrders.data.orders.find((x: any) => x.id_encoded === orderName)
    if (waOrder === undefined) {
        return []
    }

    return waOrder.items.map((item: any) => {
        return {
            productId: item.product_id,
            skuId: item.sku_id,
            name: item.name,
            price: +item.price,
            totalDiscount: +item.total_discount,
            quantity: +item.quantity
        }
    })
}

export default waGetOrderData