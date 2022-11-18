import { ConnectionEnum } from '../enums/connection.enum'

export type ConnectionUrlParam = 'l' | 'br' | 'bl' | 'bd' | 'bc'

const connectionNames: { [key in ConnectionEnum]: { name: string, code: string, urlParam:  ConnectionUrlParam} } = {
    conn_lateral: {name: 'Боковое', code: 'бок', urlParam: 'l'},
    conn_bottom_left: {name: 'Нижнее слева', code: 'нп слева', urlParam: 'bl'},
    conn_bottom_right: {name: 'Нижнее справа', code: 'нп справа', urlParam: 'br'},
    conn_bottom_center: {name: 'Нижнее центр', code: 'нп центр', urlParam: 'bc'},
    conn_bottom_double_sided: {name: 'Нижнее разностороннее', code: 'нп разн.', urlParam: 'bd'}
}

export default connectionNames