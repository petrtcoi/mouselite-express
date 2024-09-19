import mongoose from 'mongoose'
import KradSiteRadiator from './kradSiteRadiator.model'

export type KradSiteModelType = {
	id: string
	name: string
	description: string
	doc_id: string

	imageMain: string
	images: string[]
	schema?: string

	conn_lateral: number | null
	conn_bottom_right: number | null
	conn_bottom_left: number | null
	conn_bottom_right_tv: number | null
	conn_bottom_left_tv: number | null
	conn_bottom_center: number | null
	conn_bottom_double_sided: number | null
	conn_bottom_double_sided_tv: number | null

	montage_wall: number | null
	montage_floor: number | null

	material: string
	diametrTrubok?: string
	conn?: string
	connWall?: string
	connFloor?: string
	realisation: string
	surface: string
	basicColor: string
	pressure: string
	pressureMax: string
	temperatureMax: string
	thread: string
	interaxle: string
	warranty: string
	lifetime?: string
}

const schema = new mongoose.Schema<KradSiteModelType>(
	{
		id: { type: String, required: true },
		name: { type: String, required: true },
		description: { type: String, required: true },
		doc_id: { type: String, required: true },

		imageMain: { type: String, required: true },
		images: [{ type: String, required: true }],
		schema: { type: String, required: false },

		conn_lateral: { type: Number, required: false },
		conn_bottom_right: { type: Number, required: false },
		conn_bottom_left: { type: Number, required: false },
		conn_bottom_center: { type: Number, required: false },
		conn_bottom_double_sided: { type: Number, required: false },

		montage_wall: { type: Number, required: false },
		montage_floor: { type: Number, required: false },

		material: { type: String, required: true },
		diametrTrubok: { type: String, required: false },
		conn: { type: String, required: false },
		connWall: { type: String, required: false },
		connFloor: { type: String, required: false },
		realisation: { type: String, required: true },
		surface: { type: String, required: true },
		basicColor: { type: String, required: true },
		pressure: { type: String, required: true },
		pressureMax: { type: String, required: true },
		temperatureMax: { type: String, required: true },
		thread: { type: String, required: true },
		interaxle: { type: String, required: true },
		warranty: { type: String, required: true },
		lifetime: { type: String, required: false },
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
)

schema.virtual('radiators', {
	ref: KradSiteRadiator,
	localField: 'id',
	foreignField: 'modelId',
})

const KradSiteModel = mongoose.model('KradSiteModel', schema)
export default KradSiteModel
