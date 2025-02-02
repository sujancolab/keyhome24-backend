import PrismaDriver from "../drivers/PrismaDriver";

export default class UsersController {
    static async createUser(
        email: string,
        password: string,
        name: string,
        phone: string
    ) {
        return await PrismaDriver.users.create({
            data: {
                email,
                password,
                name,
                phone,
            },
        });
    }

    static async getUserByEmail(email: string) {
        return await PrismaDriver.users.findUnique({
            where: {
                email,
            },
        });
    }
    static async getUserById(id: any) {
        return await PrismaDriver.users.findUnique({
            where: {
                id,
            },
        });
    }
    static async updateUserPassword(
        userId: number,
        password?: string,
    ) {
        // Prepare the data object with the fields that need to be updated
        const data: { password?: string } = {};
    
       
        if (password) data.password = password;
        
    
        // Update user in the database
        return await PrismaDriver.users.update({
            where: { id: userId },
            data,
        });
    }
    
}
