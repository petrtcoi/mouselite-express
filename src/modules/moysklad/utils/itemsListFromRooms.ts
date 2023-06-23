import { Types } from "mongoose"
import { RoomType } from "../../../models/room.model"
import { RoomItem } from "../types/roomItem.type"

const itemsListFromRooms = (rooms: RoomType[]): RoomItem[] => {

    const items = rooms
        .map(room => {
            return [...room.itemRadiators || [], ...room.itemAccessories || []]
        })
        .flat()
        .reduce((acc: RoomItem[], item: any) => {
            const oldIndex = acc.findIndex(x => {
                if (x.accessory) {
                    return x.accessory.toString() === (item.accessory?.toString() || 'none')
                }
                if (x.model) {
                    return (
                        // @ts-ignore
                        (x.model?.toString() || 'none') === (item.model?.toString() || 'none') &&
                        // @ts-ignore
                        (x.color?.toString() || 'none') === (item.color?.toString() || 'none') &&
                        // @ts-ignore
                        (x.connection?.toString() || 'none') === (item.connection?.toString() || 'none') &&
                        // @ts-ignore
                        (x.sections?.toString() || 'none') === (item.sections?.toString() || 'none')
                    )
                }
            })
            if (oldIndex === -1) {
                const newAcc = [...acc, item]
                return acc.concat(item)
            } else {
                const newAcc = acc.map((_item, index) => {
                    return index === oldIndex ?
                        { ...item, quantity: acc[index].quantity + item.quantity }
                        : acc[index]
                })
                return acc.map((_item, index) => {
                    return index === oldIndex ?
                        { ...item, quantity: acc[index].quantity + item.quantity }
                        : acc[index]
                })
            }

        }, [] as RoomItem[])
    return items
}

export default itemsListFromRooms