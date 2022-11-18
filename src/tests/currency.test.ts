import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'


import { currencyOne, currencyTwo } from './fixtures/db'
import * as dependencies from '../modules/currency/utils/getEuroRate'
import Currency from './../models/currency.models'

// beforeAll(async () => {
//     await mongoose.connect(process.env.MONGODB_URL as string)
// })
afterAll(async () => {
    await mongoose.connection.close()
})

describe('Currency', () => { 

    beforeEach(async () => {
        await Currency.deleteMany({})
    })

    test('add EURO doc if no docs and add correct data', async () => {

        const docCountInit = await Currency.countDocuments()
        expect(docCountInit).toBe(0)

        jest.spyOn(dependencies, 'getEuroRate').mockResolvedValue(currencyOne.rate)
        const response = await request(app)
            .post('/currency')
            .send({})
            .expect(200)
        expect(response.body.name).toBe("EURO")
        expect(response.body.rate).toBe(currencyOne.rate)

        const docCountAfter = await Currency.countDocuments()
        expect(docCountAfter).toBe(1)

    })

    test('update currency doc if existed and dont add new one', async () => {

        jest.spyOn(dependencies, 'getEuroRate').mockResolvedValue(currencyOne.rate)
        await request(app)
            .post('/currency')
            .send({})
        await request(app)
            .post('/currency')
            .send({})

        const docCountAfter = await Currency.countDocuments()
        expect(docCountAfter).toBe(1)

    })


    test('dont update currency if difference less than 3%', async () => {

        jest.spyOn(dependencies, 'getEuroRate').mockResolvedValue(currencyOne.rate)
        const response = await request(app)
            .post('/currency')
            .send({})
        expect(response.body.rate).toBe(currencyOne.rate)

        jest.spyOn(dependencies, 'getEuroRate').mockResolvedValue(currencyOne.rate * 1.02)
        const response2 = await request(app)
            .post('/currency')
            .send({})
        expect(response2.body.rate).toBe(currencyOne.rate)

        jest.spyOn(dependencies, 'getEuroRate').mockResolvedValue(currencyOne.rate * 0.98)
        const response3 = await request(app)
            .post('/currency')
            .send({})
        expect(response3.body.rate).toBe(currencyOne.rate * 0.98)

        const docCountAfter = await Currency.countDocuments()
        expect(docCountAfter).toBe(1)

    })


    test('get currency returns correct data currency', async () => {

        jest.spyOn(dependencies, 'getEuroRate').mockResolvedValue(currencyOne.rate)
        const response = await request(app)
            .post('/currency')
            .send({})

        const response1 = await request(app)
            .get('/currency/EURO')
            .send({})
        expect(response1.body.rate).toEqual(currencyOne.rate)


        jest.spyOn(dependencies, 'getEuroRate').mockResolvedValue(currencyTwo.rate)
        await request(app)
            .post('/currency')
            .send({})


        const response2 = await request(app)
            .get('/currency/EURO')
            .send({})
        expect(response2.body.rate).toEqual(currencyTwo.rate)
    })

})