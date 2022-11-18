import { OzonItem } from '../../../models/ozon/ozonItem.models'
import { OzonUpdateStockItem } from "../../../models/ozon/ozonUpdateItem"
import { OZON_WAREHOUSE } from '../constants/ozonWarehouses.enum'
import getDbArboniaStock from "./getDbArboniaStock"


const addDbQuantity = async (items: OzonItem[]): Promise<Pick<OzonUpdateStockItem, 'offer_id' | 'stock' | 'warehouse_id'>[]> => {

    const dbItems = await getDbArboniaStock()


    return items
        .map(item => {
            const [skuModel, skuSections, skuColor, skuConnection] = item.offer_id.split('/')
            const dbItem = dbItems.find(item =>
            (
                item.model === skuModel &&
                item.sections === +skuSections &&
                item.color == skuColor.toLowerCase() &&
                (item.connection === '69 твв' ? skuConnection === '№69 ТВВ' : skuConnection === '№12 боковое 3')
            )
            )
            return {
                offer_id: item.offer_id,
                warehouse_id: OZON_WAREHOUSE.HOGART_MSK,
                stock: dbItem? +dbItem.quantity || 0 : 0
            }
        })

}

export default addDbQuantity