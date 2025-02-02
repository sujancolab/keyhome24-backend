import PrismaDriver from "../drivers/PrismaDriver";

export default class PlansController {
    static async getPlans() {
        return await PrismaDriver.plans.findMany();
    }

    static async getPlanById(id: string) {
        return await PrismaDriver.plans.findUnique({
            where: {
                id,
            },
        });
    }
}
