export type KradSiteCsvModel = {
	id: string
	name: string
	description: string
	doc_id: string

	imageMain: string
	images: string
	schema: string

	conn_lateral: string
	conn_bottom_right: string
	conn_bottom_left: string
	conn_bottom_right_tv: string
	conn_bottom_left_tv: string
	conn_bottom_center: string
	conn_bottom_double_sided: string

	montage_wall: string
	montage_floor: string

	material: string
	diametrTrubok: string
	conn: string
	connWall: string
	connFloor: string
	realisation: string
	surface: string
	basicColor: string
	pressure: string
	pressureMax: string
	temperatureMax: string
	thread: string
	interaxle: string
	warranty: string
	lifetime: string
}
