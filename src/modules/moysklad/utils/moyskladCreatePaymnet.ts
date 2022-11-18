import moyskladHttp from './moyskladHttp'
import { MoyskaldOrder } from "../../../types/moyskladOrder"
import getUniqName from './getUniqName'

import { paymentInState, cashInState, baseUrl } from '../../../config/moySklad'


type Props = {
    order: MoyskaldOrder
    cash: number
    bank: number
}
type Result = {
    cashLink: string
    bankLink: string
}

const moySkladCreatePayment = async ({ order, bank, cash }: Props): Promise<{ result?: Result, error?: string }> => {

    let totalResult: Result = {
        cashLink: '',
        bankLink: ''
    }


    try {

        if (bank > 0) {
            const paymentInName = await getUniqName('paymentin', order.name, 1)
            const result = await moyskladHttp.post('/entity/paymentin', {
                organization: order.organization,
                agent: order.agent,
                sum: bank * 100,
                name: paymentInName,
                state: paymentInState,
                operations: [
                    {
                        meta: {
                            href: `${baseUrl}/entity/customerorder/${order.id}`,
                            type: 'customerorder',
                            mediaType: 'application/json',
                        }
                    }
                ]
            })
            totalResult['bankLink'] = result.data.meta.uuidHref || ''
        }

        if (cash > 0) {
            const cashInName = await getUniqName('cashin', order.name, 1)
            const result = await moyskladHttp.post('/entity/cashin', {
                organization: order.organization,
                agent: order.agent,
                sum: cash * 100,
                name: cashInName,
                state: cashInState,
                operations: [
                    {
                        meta: {
                            href: `${baseUrl}/entity/customerorder/${order.id}`,
                            type: 'customerorder',
                            mediaType: 'application/json',
                        }
                    }
                ]
            })
            totalResult['cashLink'] = result.data.meta.uuidHref || ''
        }

    

        return { result: totalResult }


    } catch (err) {
        if (typeof err === "string") {
            return { error: err }
        } else if (err instanceof Error) {
            return { error: err.message }
        } else {
            return { error: 'some docs errors' }
        }
    }


}

export default moySkladCreatePayment