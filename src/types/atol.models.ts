
export type AtolPaymentMethod = 'full_payment' | 'prepayment' | 'full_prepayment'
export type AtolPaymentObject = 'commodity' | 'service'
export type AtolPayments = [
    { type: 0, sum: number },
    { type: 1, sum: number },
    { type: 2, sum: number },
    { type: 3, sum: number }
]
