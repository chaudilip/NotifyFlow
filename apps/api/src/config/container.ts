import {createContainer,asValue,asClass, InjectionMode} from "awilix"
import {prisma} from "@notifyflow/database"

const container = createContainer({
    injectionMode: InjectionMode.CLASSIC
})

container.register({
    prisma: asValue(prisma),

})

export {container}
export type Container = typeof container;