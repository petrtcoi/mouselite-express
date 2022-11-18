import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'

import oauthToken from './fixtures/oauthToken'

import Project from '../models/project.models'
import Version from '../models/version.model'
import Room, { RoomType } from '../models/room.model'

import { projectOneInput } from './fixtures/projects'
import { roomOneInput } from './fixtures/rooms'



describe('Room', () => {
    jest.setTimeout(30000)

    afterAll(async () => {
        await mongoose.connection.close()
    })

    beforeEach(async () => {
        await Promise.all([
            Room.deleteMany({}),
            Version.deleteMany({}),
            Project.deleteMany({})
        ])
    })


    test('create new room for version with type regular', async () => {


        await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectOneInput })
            .expect(200)

        const anyVersion = await Version.findOne({}).populate('rooms')

        if (!anyVersion || !anyVersion.rooms || !anyVersion.rooms[0]) {
            throw new Error()
        }
        const defaultRoom = anyVersion?.rooms[0] as any
        expect(defaultRoom.type).toBe('zero')
        expect((await Room.find({ version: anyVersion._id })).length).toBe(1)

        const response = await request(app)
            .post('/room')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ versionId: anyVersion._id })
            .expect(200)
        expect((await Room.find({ version: anyVersion._id })).length).toBe(2)
        expect(response.body.room.type).toBe('regular')

        const response2 = await request(app)
            .post('/room')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({
                ...roomOneInput,
                versionId: anyVersion._id,
                type: 'Wrong Type'
            })
            .expect(200)
        expect((await Room.find({ version: anyVersion._id })).length).toBe(3)
        expect(response2.body.room.type).toBe('regular')
        expect(response2.body.room.description).toBe('')
        expect(response2.body.room.title).toBe(roomOneInput.title)
        expect(response2.body.room.square).toBe(roomOneInput.square)
        expect(response2.body.room.powerCalculated).toBe(roomOneInput.powerCalculated)
    })

    test('can delete room only with regular type and not with zero type', async () => {

        await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectOneInput })
            .expect(200)
        const anyVersion = await Version.findOne({}).populate('rooms')
        await request(app)
            .post('/room')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ versionId: anyVersion?._id })
            .expect(200)
        await request(app)
            .post('/room')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ versionId: anyVersion?._id })
            .expect(200)


        const rooms = await Room.find({ version: anyVersion?._id })
        expect(rooms.filter(room => room?.type === 'zero').length).toBe(1)
        expect(rooms.filter(room => room?.type === 'regular').length).toBe(2)

        await Promise.all(rooms.map(async room => {
            await request(app)
                .delete('/room')
                .set('Accept', 'application/json')
                .set({ 'Authorization': `OAuth ${oauthToken}` })
                .send({ id: room._id })
                .expect(room.type === 'zero' ? 406 : 200)
        }))

        const restRooms = await Room.find({ version: anyVersion?._id })
        expect(restRooms.length).toBe(1)
        expect(restRooms[0].type).toBe('zero')
    })

    test('update room accepted fields only', async () => {
        await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectOneInput })
            .expect(200)

        const room = await Room.findOne({})
        expect(room).not.toBeNull()
        const updates: Partial<RoomType & mongoose.Document> = {
            _id: new mongoose.Types.ObjectId(),
            title: 'New title',
            description: 'new description',
            powerCalculated: 999,
            version: new mongoose.Types.ObjectId()
        }

        await request(app)
            .patch('/room')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: room?._id, updates: updates })
            .expect(200)


        const updatedRoom = await Room.findOne({ _id: room?._id })
        expect(updatedRoom).not.toBeNull()
        expect(updatedRoom?._id).toStrictEqual(room?._id)
        expect(updatedRoom?.version).toStrictEqual(room?.version)
        expect(updatedRoom?.square).toStrictEqual(room?.square)

        expect(updatedRoom?.title).toStrictEqual(updates.title)
        expect(updatedRoom?.description).toStrictEqual(updates.description)
        expect(updatedRoom?.powerCalculated).toStrictEqual(updates.powerCalculated)

    })

})