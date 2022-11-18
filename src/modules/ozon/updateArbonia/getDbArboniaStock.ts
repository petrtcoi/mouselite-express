import StockBrandItem, { StockBrandItemType } from "../../../models/stockBrandItem.models"


const getDbArboniaStock = async (): Promise<StockBrandItemType[]> => {
    const dbItemsGsDesign = (await StockBrandItem
        .find({ modelType: 'arbonia_colum', supplierCode: 'gs_design' }, { _id: 0 })
        .lean()
    )
        .map(item => {
            return {
                ...item,
                stringQuantity: item.quantity,
                quantity: item.quantity === "5-15" ? '5' : item.quantity === "> 15" ? '15' : '0'
            }
        })
        .filter(item => item.quantity !== '0')

    return [...dbItemsGsDesign]
}

export default getDbArboniaStock