import { Request, Response } from 'express'
import googleSheetRead from '../../utils/googleSheetRead'
import KradModel from './models/kradModel.model'
import KradRadiator, { KradRadiatorType } from './models/kradRadiator.model'
import { KradCsvModelType } from './typescript/types/kradCsvModel.type'
import { KradCsvRadiatorType } from './typescript/types/kradCsvRadiator.type'

const GOOGLE_DOC_ID = 'd/1P4VKpzbo_a4Hkz0gSUbOcdkaF09FmhkOMpxrmKjoqhw/d'

const updateDb = async (_req: Request, res: Response): Promise<void> => {
	let modelsCount = 0
	let radiatorsCount = 0

	const modelsData = (await googleSheetRead(GOOGLE_DOC_ID)) as KradCsvModelType[]
	await KradModel.deleteMany({})
	await KradRadiator.deleteMany({})

	for (const csv of modelsData) {
		const modelName = csv.id

		const model = new KradModel({
			name: modelName,
			title: csv.name,
			conn_lateral: csv.conn_lateral ? +csv.conn_lateral : undefined,
			conn_bottom_right: csv.conn_bottom_right ? +csv.conn_bottom_right : undefined,
			conn_bottom_left: csv.conn_bottom_left ? +csv.conn_bottom_left : undefined,
			conn_bottom_right_tv: csv.conn_bottom_right_tv ? +csv.conn_bottom_right_tv : undefined,
			conn_bottom_left_tv: csv.conn_bottom_left_tv ? +csv.conn_bottom_left_tv : undefined,
			conn_bottom_center: csv.conn_bottom_center ? +csv.conn_bottom_center : undefined,
			conn_bottom_double_sided: csv.conn_bottom_double_sided ? +csv.conn_bottom_double_sided : undefined,
			montage_wall: csv.montage_wall ? +csv.montage_wall : undefined,
			montage_floor: csv.montage_floor ? +csv.montage_floor : undefined,
		})
		await model.save()
		modelsCount += 1

		const radiatorsLinkId = `d/${csv.doc_id}/d`
		const radiatorsData = (await googleSheetRead(radiatorsLinkId)) as KradCsvRadiatorType[]

		for (const csv of radiatorsData) {
			const radiator = new KradRadiator({
				modelName: modelName,
				name: csv.name,
				price: +csv.price,
				height: +csv.height,
				depth: +csv.depth,
				length: +csv.length,
				dt70: +csv.dt70,
				dt60: +csv.dt60,
				wall_consoles_name: csv.wall_consoles_name ? csv.wall_consoles_name : undefined,
			})
			await radiator.save()
			radiatorsCount += 1
		}
	}

	res.status(200).send({ models: modelsCount, radiators: radiatorsCount })
}

export default updateDb
