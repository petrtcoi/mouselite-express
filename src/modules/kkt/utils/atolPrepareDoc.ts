// import moment from 'moment-timezone'

// import { AtolDoc, AtolDocItem, AtolPaymenMethod, AtolPaymentTypes } from '../../../types/atolDoc.models'
// import { MoyskaldOrder } from '../../../types/moyskladOrder'
// import { mouseliteDoc } from '../../../config/atol.config'
// import mongoose from 'mongoose'
// import { CheckoutType } from '../../../types/checkoutType.models'

// type AtolPrepareDocProps = {
//     order: MoyskaldOrder,
//     client: { email: string } | { phone: string } | { email: string, phone: string }
//     checkoutType: CheckoutType
//     payments: {
//         cash: number
//         bank: number
//     }
// }


// const atolPrepareDoc = (data: AtolPrepareDocProps): { document?: AtolDoc, error?: string } => {


//     try {

//         const balanceSum = data.order.payedSum - data.order.shippedSum
//         const postmapymentTotal = data.order.sum - data.order.payedSum - data.payments.cash - data.payments.bank
        


//         if (postmapymentTotal < 0) {
//             throw new Error('postmapymentTotal is less than null')
//         }
//         if (postmapymentTotal !== 0 && data.checkoutType === 'paymentWithDelivery') {
//             throw new Error('not null sum for postmapymentTotal with full_Payment method')
//         }
//         if ((data.payments.cash + data.payments.bank + data.order.payedSum + postmapymentTotal) !== data.order.sum) {
//             throw new Error('wrong total payments sum')
//         }

//         const payments = [
//             { type: 0 as AtolPaymentTypes, sum: data.payments.cash },
//             { type: 1 as AtolPaymentTypes, sum: data.payments.bank },
//             { type: 2 as AtolPaymentTypes, sum: balanceSum >= 0 ? balanceSum : 0 },
//             { type: 3 as AtolPaymentTypes, sum: postmapymentTotal }
//         ]

//         const itemsPaymenyMethod: AtolPaymenMethod = data.checkoutType === 'paymentWithDelivery' ? 'full_payment' :
//             postmapymentTotal === 0 ? 'full_prepayment' : 'prepayment'



//         const items: AtolDocItem[] = data.order.items.map(item => {
//             const quantity = item.quantity - item.shipped
//             return {
//                 name: item.name,
//                 price: item.price,
//                 quantity: quantity,
//                 sum: item.price * quantity,
//                 payment_method: itemsPaymenyMethod,
//                 payment_object: item.paymentObject,
//                 vat: { type: "none" }
//             }
//         }).filter(item => item.quantity > 0)


//         const document: AtolDoc = {
//             external_id: new mongoose.Types.ObjectId().toString(),
//             timestamp: moment().tz('Europe/Moscow').format('DD.MM.YYYY HH:mm:ss'),
//             receipt: {
//                 client: data.client,
//                 company: mouseliteDoc,
//                 items,
//                 payments,
//                 total: data.order.sum - data.order.shippedSum 
//             }
//         }

//         return { document }

//     } catch (err) {
//         if (typeof err === "string") {
//             return { error: err }
//         } else if (err instanceof Error) {
//             return { error: err.message }
//         } else {
//             return { error: 'some docs errors' }
//         }
//     }




// }

// export default atolPrepareDoc