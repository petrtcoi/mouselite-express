import mongoose from 'mongoose'
import app from '../app'
import request from 'supertest'

import ItemRadiator, { ItemRadiatorInput, ItemRadiatorType } from '../models/itemRadiator.model'
import ProductConnection from '../models/products/productConnection.models'
import ProductColor from '../models/products/productColor.models'
import ProductModel from '../models/products/productModel.models'
import Version from '../models/version.model'
import Room from '../models/room.model'
import Project from '../models/project.models'

import { projectOneInput } from './fixtures/projects'

import oauthToken from './fixtures/oauthToken'




describe('ItemRadiator', () => {
    jest.setTimeout(30000)



    beforeAll(async () => {
        await Promise.all([
            Room.deleteMany({}),
            Version.deleteMany({}),
            Project.deleteMany({}),
            ItemRadiator.deleteMany({})
        ])
        await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectOneInput })
            .expect(200)
    })

    afterAll(async () => {
        await mongoose.connection.close()
    })


    test('add itemRadiator works', async () => {


        const model = await ProductModel.findOne()
        const color = await ProductColor.findOne({ group: model?.colorGroup })
        const connection = await ProductConnection.findOne({ group: model?.connectionGroup })
        const room = await Room.findOne({})

        if (!model || !color || !connection || !room) {
            throw new Error()
        }

        const newItemRadiator: ItemRadiatorInput = {
            roomId: room?._id,
            modelId: model?._id,
            colorId: color?._id,
            connectionId: connection?._id,
            quantity: 10,
            discount: 30
        }

        const response = await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...newItemRadiator })
            .expect(200)

        const itemId = response.body.itemRadiator._id

        const dbItem = await ItemRadiator.findOne({ _id: itemId }).populate('room').populate('color').populate('connection').populate('model')
        expect(dbItem).not.toBeNull()
        expect(dbItem?.model.title).toBe(model.title)
        expect(dbItem?.room.title).toBe(room.title)
        expect(dbItem?.color.title).toBe(color.title)
        expect(dbItem?.connection.title).toBe(connection.title)
    })

    test('add default quantity and discount when create if not provided', async () => {
        const model = await ProductModel.findOne()
        const room = await Room.findOne({})

        if (!model || !room) {
            throw new Error()
        }

        const newItemRadiator: ItemRadiatorInput = {
            roomId: room._id,
            modelId: model._id
        }

        const response = await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...newItemRadiator })
            .expect(200)

        const itemId = response.body.itemRadiator._id

        const dbItem = await ItemRadiator.findOne({ _id: itemId })
        if (!dbItem) {
            throw new Error()
        }
        expect(dbItem).not.toBeNull()
        expect(dbItem.quantity).toBe(1)
        expect(dbItem.discount).toBe(0)
        expect(dbItem.sections).toBeUndefined()


    })


    test('dont add radiator with wrong model / room / color / connection id', async () => {

        const model = await ProductModel.findOne()
        const color = await ProductColor.findOne({ group: model?.colorGroup })
        const connection = await ProductConnection.findOne({ group: model?.connectionGroup })
        const room = await Room.findOne({})

        const wrongColor = await ProductColor.findOne({ group: { $ne: model?.colorGroup } })
        const wrongConnection = await ProductConnection.findOne({ group: { $ne: model?.connectionGroup } })

        const newItemRadiator: ItemRadiatorInput = {
            roomId: room?._id,
            modelId: model?._id,
            colorId: color?._id,
            connectionId: connection?._id,
            quantity: 10,
            discount: 30
        }

        await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                ...newItemRadiator,
                roomId: new mongoose.Types.ObjectId()
            })
            .expect(400)

        await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                ...newItemRadiator,
                modelId: new mongoose.Types.ObjectId()
            })
            .expect(400)

        await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                ...newItemRadiator,
                modelId: undefined
            })
            .expect(400)

        await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                ...newItemRadiator,
                colorId: wrongColor?._id
            })
            .expect(400)

        await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                ...newItemRadiator,
                connectionId: wrongConnection?._id
            })
            .expect(400)
    })


    test('can populate room radiators', async () => {

        const room = await Room.findOne({}).populate('itemRadiators')

        if (!room || !room.itemRadiators) {
            throw new Error()
        }

        const itemRadiatorList = await ItemRadiator.find({ room: room?._id })
        expect(itemRadiatorList.length).toBeGreaterThan(0)
        expect(room?.itemRadiators?.length).toBe(itemRadiatorList.length)


    })


    test('update itemRadiator and throw error with wrong data: color, connection, model', async () => {

        const modelsZehnder = await ProductModel.find({ group: 'zehnder_charleston' }).limit(2)
        const colors = await ProductColor.find({ group: modelsZehnder[0].colorGroup }).limit(2)
        const connections = await ProductConnection.find({ group: modelsZehnder[0].connectionGroup }).limit(2)
        const room = await Room.findOne({})

        if (!room) throw new Error()

        const newItemRadiator = {
            roomId: room._id,
            modelId: modelsZehnder[0]._id,
            color: colors[0]._id,
            connection: connections[0]._id
        }

        const response = await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...newItemRadiator })
            .expect(200)

        const updates: Partial<ItemRadiatorType> = {
            model: modelsZehnder[1]._id,
            color: colors[1]._id,
            connection: connections[1]._id,
            quantity: 100,
            discount: 20,
            sections: 90
        }

        await request(app)
            .patch('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: response.body.itemRadiator._id, updates })
            .expect(200)

        const updatedRadiator = await ItemRadiator.findOne({ _id: response.body.itemRadiator._id })
        if (!updatedRadiator) throw new Error
        expect(updatedRadiator).toEqual(
            expect.objectContaining(updates)
        )
        expect(updatedRadiator.room.toString()).toStrictEqual(response.body.itemRadiator.room)

    })


    test('itemradiator deleted', async () => {

        const itemRadiator = await ItemRadiator.findOne({})
        if (!itemRadiator) throw new Error()

        const result = await request(app)
            .delete('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: itemRadiator._id })
            .expect(200)
        expect(result.body.itemRadiator).not.toBeNull()
        expect(itemRadiator._id.toString()).toBe(result.body.itemRadiator._id.toString())
        expect(await ItemRadiator.findOne({ _id: itemRadiator._id })).toBeNull()
    })

    test('expect delete all radiators if room deleted', async () => {

        const models = await ProductModel.find({}).limit(2)
        const version = await Version.findOne({})
        if (!version) throw new Error()

        const result = await request(app)
            .post('/room')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ versionId: version._id })
            .expect(200)

        const roomOne = result.body.room
        if (!roomOne) throw new Error()

        await ItemRadiator.deleteMany({ room: roomOne._id })
        await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                roomId: roomOne._id,
                modelId: models[0]._id,
            })
            .expect(200)
        await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                roomId: roomOne._id,
                modelId: models[1]._id,
            })
            .expect(200)


        expect((await ItemRadiator.find({ room: roomOne._id })).length).toBe(2)

        await request(app)
            .delete('/room')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: roomOne._id })
            .expect(200)
        expect((await ItemRadiator.find({ room: roomOne._id })).length).toBe(0)


        // УДАЛЕНИЕ ВЕРСИИ
        const resVersion = await request(app)
            .post('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ projectId: version.project })
            .expect(200)
        const versionTwo = resVersion.body.version
        const result2 = await request(app)
            .post('/room')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ versionId: versionTwo._id })
            .expect(200)

        const roomTwo = result2.body.room
        if (!roomTwo) throw new Error()
        await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                roomId: roomTwo._id,
                modelId: models[0]._id,
            })
            .expect(200)
        await request(app)
            .post('/itemradiator')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                roomId: roomTwo._id,
                modelId: models[1]._id,
            })
            .expect(200)

        await request(app)
            .delete('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: versionTwo._id })
            .expect(200)
        expect(await Room.findOne({ _id: roomTwo._id })).toBeNull()
        expect((await ItemRadiator.find({ room: roomTwo._id })).length).toBe(0)
    })

})