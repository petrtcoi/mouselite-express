import { RoomItem } from "./roomItem.type"

type RoomItemWithMeta = RoomItem & {
    metaHref: string
}

export type { RoomItemWithMeta }