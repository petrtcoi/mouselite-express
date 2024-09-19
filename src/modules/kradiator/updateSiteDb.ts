import { Request, Response } from 'express'
import googleSheetRead from '../../utils/googleSheetRead'
import KradSiteModel, { KradSiteModelType } from './models/kradSiteModel.model'
import KradSiteRadiator, { KradSiteRadiatorType } from './models/kradSiteRadiator.model'
import { KradSiteCsvModel } from './typescript/types/kradSiteCsvModel.type'
import { KradSiteCsvRadiator } from './typescript/types/kradSiteCsvRadiator.type'

const GENERAL_DOC_ID = 'd/1P4VKpzbo_a4Hkz0gSUbOcdkaF09FmhkOMpxrmKjoqhw/'

const updateSiteDB = async (_req: Request, res: Response) => {
	const generalCsv: KradSiteCsvModel[] = (await googleSheetRead(GENERAL_DOC_ID)) as KradSiteCsvModel[]

	const generalData: KradSiteModelType[] = generalCsv.map(general => {
		return {
			id: general.id,
			name: general.name,
			description: general.description,
			doc_id: general.doc_id,
			imageMain: general.imageMain,
			images: general.images.split(',').map(x => x.trim()),
			schema: general.schema,

			conn_lateral: general.conn_lateral ? +general.conn_lateral : null,
			conn_bottom_right: general.conn_bottom_right ? +general.conn_bottom_right : null,
			conn_bottom_left: general.conn_bottom_left ? +general.conn_bottom_left : null,
			conn_bottom_right_tv: general.conn_bottom_right_tv ? +general.conn_bottom_right_tv : null,
			conn_bottom_left_tv: general.conn_bottom_left_tv ? +general.conn_bottom_left_tv : null,
			conn_bottom_center: general.conn_bottom_center ? +general.conn_bottom_center : null,
			conn_bottom_double_sided: general.conn_bottom_double_sided ? +general.conn_bottom_double_sided : null,

			montage_wall: general.montage_wall ? +general.montage_wall : null,
			montage_floor: general.montage_floor ? +general.montage_floor : null,

			material: general.material,
			diametrTrubok: general.diametrTrubok,
			conn: general.conn,
			connWall: general.connWall,
			connFloor: general.connFloor,
			realisation: general.realisation,
			surface: general.surface,
			basicColor: general.basicColor,
			pressure: general.pressure,
			pressureMax: general.pressureMax,
			temperatureMax: general.temperatureMax,
			thread: general.thread,
			interaxle: general.interaxle,
			warranty: general.warranty,
			lifetime: general.lifetime,
		}
	})

	await KradSiteModel.deleteMany({})
	await KradSiteRadiator.deleteMany({})

	for (const model of generalData) {
		const newModel = new KradSiteModel(model)
		await newModel.save()

		const csvRadiators = (await googleSheetRead(`d/${model.doc_id}/`)) as KradSiteCsvRadiator[]

		try {
			for (const csv of csvRadiators) {
				const radiator: KradSiteRadiatorType = {
					modelId: model.id,
					name: csv.name,
					description: csv?.description || '',
					columns: +csv.columns,
					interaxle: +csv.interaxle,
					sections: +csv.sections,
					price: +csv.price,

					height: +csv.height,
					depth: +csv.depth,
					length: +csv.length,

					weight: csv.weight ? +csv.weight : undefined,
					volume: +csv.volume || undefined,
					dt70: +csv.dt70,
					dt60: +csv.dt60,

					wall_consoles_name: csv.wall_consoles_name || '',
					wall_consoles_image: csv.wall_consoles_image || '',
				}

				const newRadiator = new KradSiteRadiator(radiator)
				await newRadiator.save()
			}
		} catch (e) {
			res.status(500).send(e)
		}
	}

	res.status(200).send('ok')
}

export default updateSiteDB
