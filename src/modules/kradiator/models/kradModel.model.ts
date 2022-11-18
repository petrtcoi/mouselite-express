import mongoose from "mongoose"

import KradRadiator, { KradRadiatorType } from "./kradRadiator.model"


export type KradModelType = {
    name: string
    title: string
    conn_lateral: number | null
    conn_bottom_right: number | null
    conn_bottom_left: number | null
    conn_bottom_center: number | null
    conn_bottom_double_sided: number | null
    montage_wall: number | null
    montage_floor: number | null
}

const schema = new mongoose.Schema<KradModelType>({
    name: {type: String, required: true},
    title: {type: String, required: true},
    conn_lateral: {type: Number, required: false},
    conn_bottom_right: {type: Number, required: false},
    conn_bottom_left: {type: Number, required: false},
    conn_bottom_center: {type: Number, required: false},
    conn_bottom_double_sided: {type: Number, required: false},
    montage_wall: {type: Number, required: false},
    montage_floor: {type: Number, required: false},
})


const KradModel = mongoose.model('KradModel', schema)

export default KradModel