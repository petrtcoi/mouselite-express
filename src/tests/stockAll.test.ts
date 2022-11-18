import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'


import { stockAllRawItems, stockAllRawItemsWithTwoErrors } from './fixtures/stockAllRawItems'
import oauthToken from './fixtures/oauthToken'

import StockAllItem from './../models/stockAllItem.models'



afterAll(async () => {
    await mongoose.connection.close()
})

describe('Currency', () => {

    beforeAll(async () => {
        await StockAllItem.deleteMany({})
    })

    test('Add all items to stock', async () => {

        const response = await request(app)
            .patch('/stockall')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ items: stockAllRawItems })
            .expect(200)
        expect(response.body.removed).toBe(0)
        expect(response.body.errors).toBe(0)
        expect(response.body.saved).toBe(stockAllRawItems.length)

        const docCountInit = await StockAllItem.countDocuments()
        expect(docCountInit).toBe(stockAllRawItems.length)

    })

    test('Get stock data', async () => {

        const response = await request(app)
            .get('/stockall')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({})
            .expect(200)
        expect(response.body.items.length).toBe(stockAllRawItems.length)
    })

    test('Rewrite stock data and skip errors', async () => {

        const response = await request(app)
            .patch('/stockall')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ items: stockAllRawItemsWithTwoErrors })
            .expect(200)
        expect(response.body.removed).toBe(stockAllRawItems.length)
        expect(response.body.errors).toBe(2)
        expect(response.body.saved).toBe(stockAllRawItemsWithTwoErrors.length - 2)

        const docCountInit = await StockAllItem.countDocuments()
        expect(docCountInit).toBe(stockAllRawItemsWithTwoErrors.length - 2)

    })


})