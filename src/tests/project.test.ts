import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'


import { projectOneInput, projectTwoInput, projectThreeInput, projectWithSameTitleInput } from './fixtures/projects'
import oauthToken from './fixtures/oauthToken'

import Project, { ProjectType } from './../models/project.models'
import Currency from './../models/currency.models'
import Store from '../models/store.model'




describe('Project', () => {
    jest.setTimeout(30000)

    afterAll(async () => {
        await mongoose.connection.close()
    })
    beforeAll(async () => {
        await Promise.all([
            Project.deleteMany({}),
            Currency.deleteOne({ name: 'DEFAULT_EURO' }),
            Currency.deleteOne({ name: 'DEFAULT_VARMANN' })
        ])
    })

    test('Add new project with correct user and default store and currencies + 1st default version', async () => {

        const response = await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectOneInput })
            .expect(200)

        const project: ProjectType & mongoose.Document = response.body.project
        expect(project.title).toBe(projectOneInput.title)
        expect(project.description).toBe("")

        const dbProject = await Project.findOne({ _id: project._id }).populate('manager').populate('store').populate('versions')
        expect(dbProject).not.toBeNull()
        expect(dbProject?.manager.name).toBe("Петр Цой")
        expect(dbProject?.store.code).toBe('zehnders')
        expect(dbProject?.currencies.eur).toBe(100)
        expect(dbProject?.currencies.varmann).toBe(100)
        expect(dbProject?.versions?.length).toBe(1)

    })

    test('Add another one project', async () => {
        await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectTwoInput })
            .expect(200)


        expect(await Project.find({}).countDocuments()).toBe(2)
    })

    test('Dont allow to add project with duplicate title', async () => {

        const response = await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectWithSameTitleInput })
            .expect(400)
        expect(response.body.error).toBe('title_duplicated')
        expect(await Project.find({}).countDocuments()).toBe(2)
    })

    test('Get default rates from Db', async () => {

        await Currency.create({ name: 'DEFAULT_PROJECT_EURO', rate: 88 })
        await Currency.create({ name: 'VARMANN', rate: 95 })
        const response = await request(app)
            .post('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ ...projectThreeInput })
            .expect(200)
        expect(response.body.project.currencies.eur).toBe(88)
        expect(response.body.project.currencies.varmann).toBe(95)

    })

    test('dont update project if no id or updates field', async () => {
        const updates: Partial<ProjectType> = {
            title: 'new title'
        }
        await request(app)
            .patch('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ updates: updates })
            .expect(400)
    })

    test('Update project', async () => {

        const anotherStore = await Store.findOne({ code: 'zehndershop' })
        expect(anotherStore).not.toBeNull()

        const oldProject = await Project.findOne({})
        if (oldProject === null) {
            throw new Error
        }

        const updates: Partial<ProjectType> = {
            title: 'Some another title',
            description: 'Iam new description',
            store: anotherStore?._id,
            currencies: {
                eur: oldProject.currencies.eur,
                varmann: oldProject.currencies.varmann + 10
            },
            images: 'someimages\n someimage2'
        }

        await request(app)
            .patch('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: oldProject._id, updates: updates })
            .expect(200)


        const updatedProject = await Project.findOne({ _id: oldProject._id })
        if (updatedProject === null) throw new Error
        expect(updatedProject.title).toBe(updates.title)
        expect(updatedProject.description).toBe(updates.description)
        expect(updatedProject.manager).toStrictEqual(oldProject.manager)
        expect(updatedProject.store).toStrictEqual(updates.store)
        expect(updatedProject.currencies.varmann).toBe(updates.currencies?.varmann)
        expect(updatedProject.currencies.eur).toBe(oldProject.currencies.eur)
        expect(updatedProject.images).toBe(oldProject.images)
    })

    test('dont update if not all currencies rates', async () => {
        const oldProject = await Project.findOne({})
        if (oldProject === null) {
            throw new Error
        }
        const updates = {
            currencies: {
                varmann: oldProject.currencies.varmann + 10
            }
        }
        await request(app)
            .patch('/project')
            .set('Accept', 'application/json')
            .set({ 'Authorization': `OAuth ${oauthToken}` })
            .send({ id: oldProject._id, updates: updates })
            .expect(400)
    })



})