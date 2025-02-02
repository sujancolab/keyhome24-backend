import PrismaDriver from "../drivers/PrismaDriver";

export default class PaymentsController {
    static async savePayment(
        userId: number,
        planId: string,
        paymentId: string
    ) {
        return await PrismaDriver.paymentsStripe.create({
            data: {
                userId,
                planId,
                paymentId,
            },
        });
    }

    static async getPaymentsByPaymentId(paymentId: string) {
        return await PrismaDriver.paymentsStripe.findFirst({
            where: {
                paymentId,
            },
        });
    }
}
