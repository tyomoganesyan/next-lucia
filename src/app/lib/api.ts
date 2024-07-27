import { IUser, OptionalUser } from "./types";
import Database from 'better-sqlite3'

const authDB = new Database("auth.db")

export const addUser = (user: OptionalUser): Database.RunResult => {
    return authDB
        .prepare(`
                INSERT INTO users(id, name, surname, login, password)
                VALUES(@id, @name, @surname, @login, @password)
            `).run(user)
}

export const getAllUsers = (): IUser[] => {
    return authDB.prepare("SELECT * FROM users").all() as IUser[]
}

export const getUserByLogin = (login: string): IUser | null => {
    const result = authDB
        .prepare("SELECT * FROM users WHERE login =?")
        .get(login)
    if (result) {
        return result as IUser
    }
    return null
}

export const getUserById = (id: string): Partial<IUser> => {
    return authDB
        .prepare("SELECT name, surname, login FROM users WHERE id = ?")
        .get(id) as Partial<IUser>
}

export const updateUserById = (user: OptionalUser) => {
    return authDB
        .prepare("UPDATE users SET login = @login where id = @id").run(user)
}

export const getUsersLogin = ():Partial<IUser>[] => {
    return authDB
                .prepare("SELECT login FROM users").all() as Partial<IUser>[]
}