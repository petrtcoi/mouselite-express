import { ConnectionEnum } from '../enums/connection.enum'

export type ConnectionUrlParam = 'l' | 'br' | 'bl' | 'bd' | 'bc' | 'bltv' | 'brtv'

const connectionNames: { [key in ConnectionEnum]: { name: string; code: string; urlParam: ConnectionUrlParam } } = {
	conn_lateral: { name: 'Боковое', code: 'бок', urlParam: 'l' },
	conn_bottom_left: { name: 'Нижнее слева', code: 'нп слева', urlParam: 'bl' },
	conn_bottom_right: { name: 'Нижнее справа', code: 'нп справа', urlParam: 'br' },
	conn_bottom_center: { name: 'Нижнее центр', code: 'нп центр', urlParam: 'bc' },
	conn_bottom_double_sided: { name: 'Нижнее разностороннее', code: 'нп разн.', urlParam: 'bd' },
	conn_bottom_left_tv: { name: 'Нижнее слева с термоклапаном', code: 'нп слева тв', urlParam: 'bltv' },
	conn_bottom_right_tv: { name: 'Нижнее справа с термоклапаном', code: 'нп справа тв', urlParam: 'brtv' },
}

export default connectionNames
