import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'

import oauthToken from './fixtures/oauthToken'

import Project from '../models/project.models'
import Version, { VersionType } from '../models/version.model'

import { projectOneInput, projectTwoInput } from './fixtures/projects'
import Room from '../models/room.model'



describe('Version', () => {


    afterAll(async () => {
        await mongoose.connection.close()
    })
    beforeAll(async () => {
        await Promise.all([
            Project.deleteMany({}),
            Version.deleteMany({})
        ])
    })


    test('create version and bind it to project', async () => {

        const response = await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectOneInput })
            .expect(200)

        const projectId = response.body.project._id

        const response2 = await request(app)
            .post('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ projectId })
            .expect(200)

        const versionOne: VersionType = response2.body.version
        expect(versionOne.project).toBe(projectId)

    })

    test('dont create version for wrong projectID', async () => {

        const anyProject = await Project.findOne({})
        await Project.deleteMany({})

        await request(app)
            .post('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ projectId: anyProject?._id })
            .expect(400)
    })


    test('create many versions and can retrieve they from Project virtual', async () => {

        await Promise.all([
            Project.deleteMany({}),
            Version.deleteMany({})
        ])

        // Создаем два проекта
        const response1 = await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectOneInput })
            .expect(200)
        const projectOneId = response1.body.project._id

        const response2 = await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectTwoInput })
            .expect(200)
        const projectTwoId = response2.body.project._id
        expect((await Project.findOne({ _id: projectTwoId }).populate('versions'))?.versions?.length).toBe(1)



        // Добавляем в них версии (2 шт в первый проект и 1 шт во второй проект)
        await request(app)
            .post('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ projectId: projectOneId })
            .expect(200)
        await request(app)
            .post('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ projectId: projectOneId })
            .expect(200)

        await request(app)
            .post('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ projectId: projectTwoId })
            .expect(200)


        const projectOne = await Project.findOne({ _id: projectOneId }).populate('versions')
        expect(projectOne?.versions?.length).toBe(3)
        const projectTwo = await Project.findOne({ _id: projectTwoId }).populate('versions')
        expect(projectTwo?.versions?.length).toBe(2)
    })


    test('update variant works and dont update project and _id', async () => {

        const [someVersion, anotherVersion, ..._other] = await Version.find({})
        const updates: Partial<VersionType> & { _id: mongoose.Types.ObjectId } = {
            _id: new mongoose.Types.ObjectId(),
            project: new mongoose.Types.ObjectId(),
            title: 'some another title',
            description: 'another description',
            images: 'some more images'
        }

        await request(app)
            .patch('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: someVersion?._id, updates: updates })
            .expect(200)

        const updatedVersion = await Version.findOne({ _id: someVersion?._id })
        expect(updatedVersion).not.toBeNull()
        expect(updatedVersion?.title).toBe(updates.title)
        expect(updatedVersion?.description).toBe(updates.description)
        expect(updatedVersion?.images).toBe(updates.images)
        expect(updatedVersion?._id).toStrictEqual(someVersion._id)
        expect(updatedVersion?.project).toStrictEqual(someVersion.project)

    })

    test('remove version and dont remove if only one version in project', async () => {

        await Promise.all([
            Project.deleteMany({}),
            Version.deleteMany({})
        ])

        const response = await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectOneInput })
            .expect(200)
        const projectId = response.body.project._id


        await request(app)
            .post('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ projectId: projectId })
            .expect(200)
        await request(app)
            .post('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ projectId: projectId })
            .expect(200)

        const versions = await Version.find({ project: projectId })
        expect(versions.length).toBe(3)

        await request(app)
            .delete('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: versions[0]._id })
            .expect(200)
        const versions2 = await Version.find({ project: projectId })
        expect(versions2.length).toBe(2)

        await request(app)
            .delete('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: versions[1]._id })
            .expect(200)
        const versions3 = await Version.find({ project: projectId })
        expect(versions3.length).toBe(1)

        await request(app)
            .delete('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: versions[2]._id })
            .expect(406)
        const versions4 = await Version.find({ project: projectId })
        expect(versions4.length).toBe(1)

    })

    test('create zero type room when create version', async () => {

        const anyProject = await Project.findOne({})
        const response = await request(app)
            .post('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ projectId: anyProject?._id })
            .expect(200)
        const dbVersion = await Version.findOne({ _id: response.body.version._id }).populate('rooms')

        if (dbVersion !== null && dbVersion.rooms !== undefined && dbVersion.rooms[0] !== undefined) {
            expect(dbVersion.rooms.length).toBe(1)
            const room = dbVersion.rooms[0] as any
            expect(room.type as any).toBe('zero')
        }
    })

    test('remove all rooms when remove version', async () => {

        const anyProject = await Project.findOne({})
        const version = await Version.findOne({ project: anyProject?._id })

        const rooms = await Room.find({ version: version?._id })
        expect(rooms.length).toBeGreaterThan(0)

        await request(app)
            .delete('/version')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: version?._id })
            .expect(200)

        const roomsAfter = await Room.find({ version: version?._id })
        expect(roomsAfter.length).toBe(0)

    })


    test('copy version without items', async () => {

        const anyProject = await Project.findOne({})
        const versionOriginal = await Version.findOne({ project: anyProject?._id })
        if (!versionOriginal) throw new Error()
        await request(app)
            .post('/room')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ versionId: versionOriginal._id })
            .expect(200)
        const roomsOriginal = await Room.find({ version: versionOriginal._id })
        expect(roomsOriginal.length).toBeGreaterThan(1)


        const response = await request(app)
            .post('/versioncopy')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: versionOriginal._id, mode: 'roomsOnly' })
            .expect(200)

        const versionNew = await Version.findOne({ _id: response.body.versionNewId })
        expect(versionNew).not.toBeNull()

        expect({
            ...versionOriginal.toObject(),
            title: `(копия) ${versionOriginal.title}`
        })
            .toStrictEqual({
                ...versionNew?.toObject(),
                _id: versionOriginal._id
            })

        const newVersionRooms = await Room.find({version: versionNew?._id})
        expect(newVersionRooms.length).toBe(roomsOriginal.length)

    })

})