import { RoomItem } from "../types/roomItem.type"
import ProductAccessory from '../../../models/products/productAccessory.models'
import ProductModel from '../../../models/products/productModel.models'
import ProductConnection from '../../../models/products/productConnection.models'
import ProductColor from "../../../models/products/productColor.models"

type Props = {
    item: Omit<RoomItem, 'price' | 'quantity' | 'discount'>
}

const getMoyskaldItemName = async (props: Props): Promise<string | null> => {

    let name = ''

    if (props.item.accessory) {
        const accessory = await ProductAccessory.findOne({ _id: props.item.accessory })
        if (!accessory) return null
        name += accessory.title
    } else {
        const model = await ProductModel.findOne({ _id: props.item.model })
        if (!model) return null

        // База имени
        name += `${model.prefix} ${model.title}`.trim()

        // Секции
        if (props.item.sections) {
            name += `-${props.item.sections} секц`
        }
        name += '. '

        // Габариты
        const baseLength = model.lengthBase ? model.lengthBase : 0
        const secLength = (model.lengthSection && props.item.sections) ? model.lengthSection * props.item.sections : 0
        const length = baseLength + secLength
        name += `ВхГхШ: ${model.height}x${model.width}x${length}. `

        // Мощность
        const dt50 = model.dt50 ? props.item.sections ? Math.round(model.dt50 * props.item.sections) : model.dt50 : undefined
        const dt60 = model.dt60 ? props.item.sections ? Math.round(model.dt60 * props.item.sections) : model.dt60 : undefined
        const dt70 = model.dt70 ? props.item.sections ? Math.round(model.dt70 * props.item.sections) : model.dt70 : undefined
        name += `Мощность: `
        name += dt50 ? `${dt50}` : ''
        name += (dt50 && (dt60 || dt70)) ? '/' : ''
        name += dt60 ? `${dt60}` : ''
        name += (dt70 && dt60) ? `/${dt70}` : ''
        name += ' Вт (dT='
        name += dt50 ? `50` : ''
        name += (dt50 && (dt60 || dt70)) ? '/' : ''
        name += dt60 ? `60` : ''
        name += (dt70 && dt60) ? `/70` : ''
        name += 'C). '

        // Подключение
        if (props.item.connection) {
            const dbConnection = await ProductConnection.findOne({ _id: props.item.connection })
            if (dbConnection) {
                name += `Подключение: ${dbConnection.title}. `
            }
        }

        // Цвет
        if (props.item.color) {
            const dbColor = await ProductColor.findOne({ _id: props.item.color })
            if (dbColor) {
                name += `Цвет: ${dbColor.title}.`
            }
        }
    }


    return name
}

export default getMoyskaldItemName