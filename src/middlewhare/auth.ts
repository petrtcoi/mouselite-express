import axios from 'axios'
import { Request, Response, NextFunction } from 'express'

import User from '../models/user.models'


const YA_OAUTH_URL = 'https://login.yandex.ru/info?format=json'



const authAllUsers = async (req: Request, res: Response, next: NextFunction) => {

   
    try {
        const tokenHeader = req.header('Authorization')
        if (!tokenHeader) throw new Error
        const token = tokenHeader.replace('OAuth ', '')

        // Find user by token
        const userByToken = await User.findOne({ "tokens": token })
        if (userByToken) {
            /* @ts-ignore */
            req.user = userByToken
        } else {
            // Find user by email and add token
            const response = await axios.get(YA_OAUTH_URL, {
                headers: { 'Authorization': `OAuth ${token}` }
            })

            const userEmail = response.data.emails[0]
            const userByEmail = await User.findOne({ emails: userEmail })
            if (!userByEmail) throw new Error

            userByEmail.tokens = [...userByEmail.tokens, token]
            await userByEmail.save()
            /* @ts-ignore */
            req.user = userByEmail

        }
        next()

    } catch (err) {
        console.log('err: ', err)
        res.status(401).send('Please authenticate')
    }
}

export default authAllUsers