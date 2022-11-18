import request from 'supertest'
import app from '../app'
import oauthToken from './fixtures/oauthToken'

import * as dependencies from '../modules/twilio/utils/twilioSendMessage'



describe('Twilio API', () => {

    beforeEach(() => {
        jest.resetAllMocks()
    })

    test('return 200 when send message', async () => {
        await request(app)
            .post('/twilio')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                phoneTo: "+79626843710",
                storeCode: "zehnders",
                message: 'test message'
            })
            .expect(200)


    })

    test('set right store phoneNumber for Radiators', async () => {
        const sendMsgMock = jest.spyOn(dependencies, 'twilioSendMessage').mockImplementation(() => Promise.resolve())
        await request(app)
            .post('/twilio')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                phoneTo: "+79626843710",
                storeCode: "zehnders",
                message: "some text"
            })
        expect(sendMsgMock.mock.calls[0][0].from).toBe('whatsapp:+12185161529')
    })

    test('set right store phoneNumber for KitchenLove', async () => {
        const sendMsgMock = jest.spyOn(dependencies, 'twilioSendMessage').mockImplementation(() => Promise.resolve())
        await request(app)
            .post('/twilio')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                phoneTo: "+79626843710",
                storeCode: "kitchenlove",
                message: "some text"
            })
        expect(sendMsgMock.mock.calls[0][0].from).toBe('whatsapp:+12019776919')
    })

   
    test('return 400 if wrong store_code', async() => {
        await request(app)
            .post('/twilio')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                phoneTo: "+79626843710",
                storeCode: "wrong_code",
                message: "some message"
            })
            .expect(400)
        })

        test('return 400 if wrong phone number format', async() => {
            await request(app)
                .post('/twilio')
                .set('Accept', 'application/json')
                .set({ 'Authorization': `OAuth ${oauthToken}` })
                .send({
                    phoneTo: "79626843710",
                    storeCode: "zehnders",
                    message: "some message"
                })
                .expect(400)
            })


        test('return 400 if wrong missed data', async() => {
            await request(app)
            .post('/twilio')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                phoneTo: "79626843710",
                storeCode: "zehnders"
            })
            .expect(400)

            await request(app)
            .post('/twilio')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                storeCode: "zehnders",
                message: "text"
            })
            .expect(400)
    })


})