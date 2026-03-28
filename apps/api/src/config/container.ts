import {createContainer,asValue,asClass, InjectionMode} from "awilix"
import {prisma} from "@notifyflow/database"
import { AuthRepositroy } from "../modules/auth/auth.repository"
import { AuthService } from "../modules/auth/auth.service"
import { AuthController } from "../modules/auth/auth.controller"

const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
})

container.register({
    prisma: asValue(prisma),
    authRepository: asClass(AuthRepositroy).singleton(),
    authService:asClass(AuthService).singleton(),
    authController: asClass(AuthController).singleton()
})

export {container}
export type Container = typeof container;