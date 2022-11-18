import { Request, Response } from "express"
import mongoose from "mongoose"

import Room from "../../models/room.model"
import Version from "../../models/version.model"
import ItemRadiator from '../../models/itemRadiator.model'
import ItemAccessory from "../../models/itemAccessory.model"




const versionCopy = async (req: Request, res: Response): Promise<void> => {
    if (req.body.mode !== 'roomsOnly' && req.body.mode !== 'allData') {
        res.status(400).send({ error: 'wrong_copy_mode' })
        return
    }

    const versionOriginal = await Version.findOne({ _id: req.body.id })
    if (versionOriginal === null) {
        res.status(400).send({ error: 'version_cant_find' })
        return
    }


    const versionNewId = new mongoose.Types.ObjectId()
    try {
        const versionNew = new Version(versionOriginal)
        versionNew.title = `(копия) ${versionOriginal.title}`
        versionNew._id = versionNewId
        versionNew.isNew = true
        await versionNew.save()
        await Room.deleteMany({ version: versionNew })
    } catch (err) {
        await Version.deleteOne({ _id: versionNewId })
        res.status(500).send()
        return
    }

    const roomOriginalList = await Room.find({ version: versionOriginal._id })
    try {
        await Promise.all(roomOriginalList.map(async roomOriginal => {
            const newRoomId = new mongoose.Types.ObjectId()
            try {
                const newRoom = new Room(roomOriginal)
                newRoom._id = newRoomId
                newRoom.version = versionNewId
                newRoom.isNew = true
                await newRoom.save()

                if (req.body.mode === 'allData') {
                    try {
                        const itemRadiatorsOriginalList = await ItemRadiator.find({ room: roomOriginal._id })
                        const itemAccessoriesOriginalList = await ItemAccessory.find({ room: roomOriginal._id })

                        await Promise.all(itemRadiatorsOriginalList.map(async itemRadaitorOriginal => {
                            const newItemId = new mongoose.Types.ObjectId()
                            try {
                                const newItem = new ItemRadiator(itemRadaitorOriginal)
                                newItem._id = newItemId
                                newItem.room = newRoomId
                                newItem.isNew = true
                                await newItem.save()
                            } catch (err) {
                                console.log(err)
                                throw new Error()
                            }
                        }))

                        await Promise.all(itemAccessoriesOriginalList.map(async itemAccessoryOriginal => {
                            const newItemId = new mongoose.Types.ObjectId()
                            try {
                                const newItem = new ItemAccessory(itemAccessoryOriginal)
                                newItem._id = newItemId
                                newItem.room = newRoomId
                                newItem.isNew = true
                                await newItem.save()
                            } catch (err) {
                                console.log(err)
                                throw new Error()
                            }
                        }))


                    } catch (err) {
                        console.log(err)
                        await ItemRadiator.deleteMany({ room: roomOriginal._id })
                        await ItemAccessory.deleteMany({ room: roomOriginal._id })
                        throw new Error()
                    }
                }

            } catch (err) {
                console.log(err)
                throw new Error()
            }
        }))
    } catch {
        await Room.deleteMany({ version: versionNewId })
        res.status(500).send()
        return
    }

    res.status(200).send({ versionNewId })

}

export default versionCopy
