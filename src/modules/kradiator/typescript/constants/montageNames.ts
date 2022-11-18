import { MontageEnum } from '../enums/montage.enum'

export type MontageUrlParam = 'w' | 'f'

const montageNames: { [key in MontageEnum]: { name: string, code: string, urlParam:  MontageUrlParam} } = {
    montage_wall: { name: 'Настенный', code: '', urlParam: 'w' },
    montage_floor: { name: 'Напольный', code: 'нв', urlParam: 'f' }
}

export default montageNames