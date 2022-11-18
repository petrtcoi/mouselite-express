import { RoomItem } from '../types/roomItem.type'
import MoyskladItemHref from '../models/moyskladItemHref.model';


const getMoyskladItemHref = async (item: Omit<RoomItem, 'price' | 'quantity' | 'discount'>): Promise<string | null> => {

    const moyskladItem = item.accessory ?
        await MoyskladItemHref.findOne({ accessory: item.accessory }) :
        await MoyskladItemHref.findOne({ model: item.model, color: item.color, connection: item.connection, sections: item.sections })

    return moyskladItem ? moyskladItem.moyskladHref : null
}

export default getMoyskladItemHref