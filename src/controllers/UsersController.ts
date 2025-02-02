import PrismaDriver from "../drivers/PrismaDriver";

export default class UsersController {
    static async getAllUsers() {
        const users = await PrismaDriver.users.findMany();
        return users.map((user) => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
    }

    static async getUserById(id: number) {
        const user = await PrismaDriver.users.findUnique({
            where: {
                id,
            },
        });
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        return null;
    }

    static async countUsers() {
        return await PrismaDriver.users.count();
    }
}
