import PrismaDriver from "../drivers/PrismaDriver";

export default class AnnoncesController {
    static createAnnonce = async (
        type: string,
        transactionType: string,
        propertyType: string,
        title: string,
        description: string,
        price: number,
        rooms: number,
        baths: number,
        area: number,
        location: any,
        features: any,
        images: any,
        userId: number,
        planId: string
    ) => {
        await PrismaDriver.annonces.deleteMany({
            where: {
                status: "pending",
            },
        });

        return await PrismaDriver.annonces.create({
            data: {
                type,
                propertyType,
                transactionType,
                title,
                description,
                price,
                rooms,
                baths,
                area,
                location,
                features,
                status: "pending",
                images,
                userId,
                planId,
            },
        });
    };

    static async getAnnonces() {
        return await PrismaDriver.annonces.findMany({
            where: {
                status: "paid",
                expirationDate: {
                    gt: new Date(),
                },
            },
        });
    }

    static async getAnnonceById(id: number) {
        return await PrismaDriver.annonces.findUnique({
            where: {
                id,
            },
        });
    }

    static async getAnnoncesByUserId(userId: number) {
        return await PrismaDriver.annonces.findMany({
            where: {
                userId,
                status: "paid",
                expirationDate: {
                    gt: new Date(),
                },
            },
        });
    }

    static async updateAnnonce(id: number, data: Partial<any>) {
        return await PrismaDriver.annonces.update({
            where: {
                id,
            },
            data,
        });
    }

    static async deleteAnnonce(id: number) {
        return await PrismaDriver.annonces.delete({
            where: {
                id,
            },
        });
    }
}
