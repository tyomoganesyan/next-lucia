"use server"

import { OptionalUser } from "./types"
import { nanoid } from "nanoid"
import bcrypt from 'bcrypt'
import { addUser, getUserById, getUserByLogin, getUsersLogin, updateUserById } from "./api"
import { redirect } from "next/navigation"
import { createAuthSession, destroySession, verifyAuth } from "./auth"
import { cookies } from "next/headers"

export const handleSignup = async (prev: unknown, data: FormData) => {

    if (!data.get('name') || !data.get('surname')) {
        return {
            message: "Please fill all the fields"
        }
    }

    const found = getUserByLogin(data.get('login') as string)
    if (found) {
        return {
            message: "Login is busy!"
        }
    }

    const user: OptionalUser = {
        id: nanoid(),
        name: data.get('name') as string,
        surname: data.get('surname') as string,
        login: data.get('login') as string,
    }

    user.password = await bcrypt.hash(data.get('password') as string, 10)
    console.log(addUser(user))
    redirect("/login")

}
let count = 0
let then: number
let now: number


export const handleLogin = async (prev: unknown, data: FormData) => {

    if (!data.get('login') || !data.get('password')) {
        return {
            message: "please fill all the fields"
        }
    }

    let login = data.get('login') as string
    let password = data.get('password') as string
    let user = getUserByLogin(login)

    if (!user) {
        return {
            message: "the login is incorrect!"
        }
    }

    let match = await bcrypt.compare(password, user.password)
    now = new Date().getMinutes()
    console.log("now:" + now)

    if (now - then < 1) {
        console.log("now-then=", now - then)
        return {
            message: "youre blocked for 3 mins"
        }
    }

    if (count > 2) {
        then = new Date().getMinutes()
        console.log(then, "then")
        count = 0
        return {
            message: "you are blocked for 3 mins"
        }
    }
    if (user.login == login && !match) {
        count++
        console.log("count:" + count)
        return {
            message: "password is wrong!!"
        }
    }

    if (user?.login == login && match && count < 3) {
        count = 0
    }

    await createAuthSession(user.id)
    redirect("/profile")
}


export const handleChangeLogin = async (prev: unknown, data: FormData) => {

    if (!data.get('newLogin') || !data.get('password')) {
        return {
            message: "please fill all the fields"
        }
    }
    const result = await verifyAuth()
    if (!result.user) {
        redirect('/login')
    }
    const login = getUserById(result.user.id).login as string
    let user = getUserByLogin(login)
    if (!user) {
        return {
            message: "the login is incorrect!"
        }
    }


    const newLogin = data.get('newLogin') as string
    const password = data.get('password') as string
    const logins = getUsersLogin()
    console.log(logins)
    if(logins.some(elm => elm.login == newLogin )) {
        return {
            message:"Login already exists"
        }
    }

    const match = await bcrypt.compare(password,user.password)
    
    if(!match) {
        return {
            message:"password is incorrect"
        }
    }

    const obj = {
        id:result.user.id,
        login:data.get('newLogin') as string
    }
    
    updateUserById(obj)

}




export const handleLogout = async () => {
    await destroySession()
    redirect("/login")
}
