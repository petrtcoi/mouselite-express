import mongoose from "mongoose"
import request from 'supertest'
import app from '../app'

import StockBrandItem from "../models/stockBrandItem.models"
import oauthToken from "./fixtures/oauthToken"
import { stockBrandItems, stockBrandItemsWithOneError, stockBrandItemsAnotherSupplier } from './fixtures/stockBrandItems'

afterAll(async () => {
    await mongoose.connection.close()
})

describe('StockBrandItems', () => {

    beforeAll(async () => {
        await StockBrandItem.deleteMany({})
    })

    test('Add items to stock', async () => {
        const response = await request(app)
            .patch('/stockbrand')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ items: stockBrandItems })
            .expect(200)
        expect(response.body.removed).toBe(0)
        expect(response.body.errors).toBe(0)
        expect(response.body.saved).toBe(stockBrandItems.length)

        const docCountInit = await StockBrandItem.countDocuments()
        expect(docCountInit).toBe(stockBrandItems.length)
    })

    test('Get items from db', async () => {
        const response = await request(app)
            .get('/stockbrand')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ items: stockBrandItems })
            .expect(200)
        expect(response.body.items.length).toBe(stockBrandItems.length)
    })

    test('Rewrite stock data and skip errors', async () => {

        const response = await request(app)
            .patch('/stockbrand')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ items: stockBrandItemsWithOneError })
            .expect(200)
        expect(response.body.removed).toBe(stockBrandItems.length)
        expect(response.body.errors).toBe(1)
        expect(response.body.saved).toBe(stockBrandItemsWithOneError.length - 1)

        const docCountInit = await StockBrandItem.countDocuments()
        expect(docCountInit).toBe(stockBrandItemsWithOneError.length - 1)
    })

    test('dont rewrite docs with another supplier', async () => {

        await request(app)
            .patch('/stockbrand')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ items: stockBrandItems })
            .expect(200)

        await request(app)
            .patch('/stockbrand')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ items: stockBrandItemsAnotherSupplier })
            .expect(200)

        const docCountInit = await StockBrandItem.countDocuments()
        expect(docCountInit).toBe(
            stockBrandItems.length +
            stockBrandItemsAnotherSupplier.length
        )

    })
})
