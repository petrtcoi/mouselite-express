import { Request, Response } from "express"
import mongoose from "mongoose"
import moment from 'moment-timezone'
import AtolUuid from '../../models/atolUuid'
import atolConfig, { mouseliteDoc } from "../../config/atol.config"

import atolGetToken from "./utils/atolGetToken"
import moySkladCreatePayment from "./../moysklad/utils/moyskladCreatePaymnet"
import moyskladGetOrderInfo from "./../moysklad/utils/moyskladGetOrderInfo"
import moySkladCreateDemand from "./../moysklad/utils/moyskladCreateDemand"
import atolHttp from "./utils/atolHttp"

import { AtolReceipt } from "../../types/atolReceipt.models"
import { AtolClient } from "../../types/atolClient.models"
import { AtolDoc } from "../../types/atolDoc.models"




type Body = {
    orderName: string
    client: AtolClient
    receipt: AtolReceipt
}

const checkout = async (req: Request, res: Response) => {
    const { orderName, client, receipt }: Body = req.body

    const cash = (receipt.payments.find(x => x.type === 0) || {sum: -1}).sum 
    const bank = (receipt.payments.find(x => x.type === 1) || {sum: -1}).sum 

    if (receipt.type === 'paymentOnly' && cash <= 0 && bank <= 0) {
        res.status(400).send('Сумма прихода должна быть больше 0, если идет предоплата')
        return
    }
    if (cash < 0 || bank < 0) {
        res.status(400).send('Ошибка в свойстве receipt.payments - есть значения меньше нуля или не полные данные')
        return
    }
    if (receipt.type !== 'paymentOnly' && receipt.type !== 'withDelivery') {
        res.status(400).send('Не правильныы reciept.type')
        return
    }

    if (!client.email && !client.phone) {
        res.status(400).send('wrong client contacts datap')
        return
    }


    const { token: atolToken } = await atolGetToken()
    if (!atolToken) {
        res.status(500).send('cant get atol token')
        return
    }


    // const data = await atolHttp.get(`/${atolConfig.group_code}/report/a5c7cb21-9e31-4d17-8170-cd012577c314`)
    // res.status(200).send(data.data)
    // return

    const { order } = await moyskladGetOrderInfo({ orderName })
    if (!order) {
        res.status(500).send('Не удалось найти заказ с данным названием')
        return
    }


    // ОТПРАВЛЯЕМ ККТ

    const externalId = new mongoose.Types.ObjectId().toString()
    const timestamp = moment().tz('Europe/Moscow').format('DD.MM.YYYY HH:mm:ss')

    const atolDoc: AtolDoc = {
        external_id: externalId,
        timestamp,
        receipt: {
            client,
            company: mouseliteDoc,
            items: receipt.items.map(item => { return { ...item, vat: { type: "none" } } }),
            payments: receipt.payments,
            total: receipt.total
        }
    }

    const atolResult = await atolHttp.post(`/${atolConfig.group_code}/sell`, atolDoc, {
        headers: {
            "Content-type": "application/json; charset=utf-8",
            "Token": atolToken
        }
    })
    if (atolResult.status !== 200) {
        res.status(500).send(`error with Atol: ${atolResult.data}`)
    }
    // const atolResult = { data: { uuid: 'hello' } }

    // ЗАПИСЫВАЕМ В МОЙ СКЛАД
    const paymentDocsResult = await moySkladCreatePayment({ order: order, bank: bank, cash: cash })
    const docsLinks: any = paymentDocsResult.result || { cashLink: 'ОШИБКА', bankLink: 'ОШИБКА' }

    if (receipt.type === 'withDelivery') {
        const result = await moySkladCreateDemand({ order: order, items: receipt.items })
        docsLinks['demandLink'] = result.result?.demandLink || 'ОШИБКА'
    }

    // ЗАПИСЫВАЕМ В Mongo
    const uuid = new AtolUuid({
        orderName,
        externalId,
        uuid: atolResult.data.uuid
    })
    await uuid.save()


    res.status(200).send({
        atol: { ...atolResult.data },
        docsLinks
    })


}

export default checkout