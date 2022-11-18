import { TubogRadiatorType } from "./tubogRadiatorType.type"

export type TubogCsvConnectionType = {
    id: string
    type: TubogRadiatorType
    code: string
    name: string
    thread: string
    price: string
    image: string
}