import { RoomInput } from "../../models/room.model"

export const roomOneInput: Omit<RoomInput, 'version'> = {
    title: 'Some room',
    square: 22,
    powerCalculated: 2200,
}