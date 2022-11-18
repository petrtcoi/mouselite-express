import mongoose from 'mongoose'
import app from '../app'
import request from 'supertest'




describe('fill test db with product data', () => {
    jest.setTimeout(100000)

    afterAll(async () => {
        await mongoose.connection.close()
    })


    test('update db', async () => {


        const results = await request(app)
            .patch('/product')
            .send({})
            .expect(200)



    })

})