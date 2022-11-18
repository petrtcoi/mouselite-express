import mongoose from 'mongoose'
import app from '../app'
import request from 'supertest'

import ItemAccessory, { ItemAccessoryInput, ItemAccessoryType } from '../models/itemAccessory.model'
import ProductAccessory from '../models/products/productAccessory.models'

import Version from '../models/version.model'
import Room from '../models/room.model'
import Project from '../models/project.models'

import { projectOneInput } from './fixtures/projects'

import oauthToken from './fixtures/oauthToken'




describe('ItemAccessory', () => {
    jest.setTimeout(30000)



    beforeAll(async () => {
        await Promise.all([
            Room.deleteMany({}),
            Version.deleteMany({}),
            Project.deleteMany({}),
            ItemAccessory.deleteMany({})
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




    test('add itemAccessory works', async () => {


        const accessory = await ProductAccessory.findOne()
        const room = await Room.findOne({})

        if (!accessory || !room) {
            throw new Error()
        }

        const newItemAccessory = {
            roomId: room?._id,
            accessoryId: accessory?._id,
            quantity: 10,
            discount: 30
        }

        const response = await request(app)
            .post('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...newItemAccessory })
            .expect(200)

        const itemId = response.body.itemAccessory._id

        const dbItem = await ItemAccessory.findOne({ _id: itemId }).populate('room').populate('accessory')
        expect(dbItem).not.toBeNull()
        expect(dbItem?.accessory.title).toBe(accessory.title)
        expect(dbItem?.room.title).toBe(room.title)
    })




    test('add default quantity and discount when create if not provided', async () => {
        const accessory = await ProductAccessory.findOne()
        const room = await Room.findOne({})

        if (!accessory || !room) {
            throw new Error()
        }

        const newItemAccessory: ItemAccessoryInput = {
            roomId: room._id,
            accessoryId: accessory._id
        }

        const response = await request(app)
            .post('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...newItemAccessory })
            .expect(200)

        const itemId = response.body.itemAccessory._id

        const dbItem = await ItemAccessory.findOne({ _id: itemId })
        if (!dbItem) {
            throw new Error()
        }
        expect(dbItem).not.toBeNull()
        expect(dbItem.quantity).toBe(1)
        expect(dbItem.discount).toBe(0)


    })




    test('dont add accessory with wrong accessoryId / room ', async () => {

        const accessory = await ProductAccessory.findOne()
        const room = await Room.findOne({})


        const newItemAccessory: ItemAccessoryInput = {
            roomId: room?._id,
            accessoryId: accessory?._id,
            quantity: 10,
            discount: 30
        }

        await request(app)
            .post('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                ...newItemAccessory,
                roomId: new mongoose.Types.ObjectId()
            })
            .expect(400)

        await request(app)
            .post('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                ...newItemAccessory,
                accessoryId: new mongoose.Types.ObjectId()
            })
            .expect(400)

        await request(app)
            .post('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                ...newItemAccessory,
                accessoryId: undefined
            })
            .expect(400)


    })




    test('can populate room accessories', async () => {

        const room = await Room.findOne({}).populate('itemAccessories')

        if (!room || !room.itemAccessories) {
            throw new Error()
        }

        const itemAccessoryList = await ItemAccessory.find({ room: room?._id })
        expect(itemAccessoryList.length).toBeGreaterThan(0)
        expect(room?.itemAccessories?.length).toBe(itemAccessoryList.length)

    })




    test('update itemAccessory and throw error with wrong data: accessory', async () => {

        const accessories = await ProductAccessory.find({}).limit(2)
        const room = await Room.findOne({})

        if (!room) throw new Error()

        const newItemAccessory: ItemAccessoryInput = {
            roomId: room._id,
            accessoryId: accessories[0]._id,
        }

        const response = await request(app)
            .post('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...newItemAccessory })
            .expect(200)

        const updates: Partial<ItemAccessoryType> = {
            accessory: accessories[1]._id,
            quantity: 100,
            discount: 20,
        }

        await request(app)
            .patch('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: response.body.itemAccessory._id, updates })
            .expect(200)

        const updatedAccessory = await ItemAccessory.findOne({ _id: response.body.itemAccessory._id })
        if (!updatedAccessory) throw new Error
        expect(updatedAccessory).toEqual(
            expect.objectContaining(updates)
        )
        expect(updatedAccessory.room.toString()).toStrictEqual(response.body.itemAccessory.room)

    })




    test('itemaccessory deleted', async () => {

        const itemAccessory = await ItemAccessory.findOne({})
        if (!itemAccessory) throw new Error()

        const result = await request(app)
            .delete('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: itemAccessory._id })
            .expect(200)
        expect(result.body.itemAccessory).not.toBeNull()
        expect(itemAccessory._id.toString()).toBe(result.body.itemAccessory._id.toString())
        expect(await ItemAccessory.findOne({ _id: itemAccessory._id })).toBeNull()
    })


    test('expect delete all accessories if room deleted', async () => {

        const accessories = await ProductAccessory.find({}).limit(2)
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

        await ItemAccessory.deleteMany({ room: roomOne._id })
        await request(app)
            .post('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                roomId: roomOne._id,
                accessoryId: accessories[0]._id,
            })
            .expect(200)
        await request(app)
            .post('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                roomId: roomOne._id,
                accessoryId: accessories[1]._id
            })
            .expect(200)


        expect((await ItemAccessory.find({ room: roomOne._id })).length).toBe(2)

        await request(app)
            .delete('/room')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: roomOne._id })
            .expect(200)
        expect((await ItemAccessory.find({ room: roomOne._id })).length).toBe(0)


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
            .post('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                roomId: roomTwo._id,
                accessoryId: accessories[0]._id
            })
            .expect(200)
        await request(app)
            .post('/itemaccessory')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                roomId: roomTwo._id,
                accessoryId: accessories[0]._id
            })
            .expect(200)

        await request(app)
            .delete('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: versionTwo._id })
            .expect(200)
        expect(await Room.findOne({ _id: roomTwo._id })).toBeNull()
        expect((await ItemAccessory.find({ room: roomTwo._id })).length).toBe(0)
    })

})