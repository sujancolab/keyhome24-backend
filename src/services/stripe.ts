import Stripe from "stripe";

import PlansController from "@Controllers/PlansController";
import UsersController from "@Controllers/UsersController";
import AnnoncesController from "@Controllers/AnnoncesController";
import PaymentsController from "@Controllers/PaymentsController";
import ConfigurationController from "@Controllers/ConfigurationController";

const configuration = await ConfigurationController.getConfiguration();

if (!configuration) {
    throw new Error("Invalid configuration");
}

const domain = configuration.domain;
const stripePrivateKey = configuration.stripePrivateKey;

const stripe = new Stripe(stripePrivateKey);

export async function payForUpload(
    annonceId: number,
    planId: string,
    userId: number
) {
    const plan = await PlansController.getPlanById(planId);
    const user = await UsersController.getUserById(userId);

    if (!plan) {
        throw new Error("Invalid plan");
    }

    if (!user) {
        throw new Error("Invalid user");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "chf",
                    product_data: {
                        name: plan.name,
                    },
                    unit_amount: plan.price * 100,
                },
                quantity: 1,
            },
        ],
        mode: "payment",
        customer_email: user.email,
        metadata: {
            annonceId,
            planId: plan.id,
            userId: user.id,
        },
        success_url: "https://" + domain + "/success/{CHECKOUT_SESSION_ID}",
        cancel_url: "https://" + domain + "/cancel",
    });

    // Return the payment link
    return session.url;
}

export async function handlePaymentSuccess(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const metadata = session.metadata;

    if (!metadata) {
        throw new Error("Invalid session");
    }

    const paymentExist = await PaymentsController.getPaymentsByPaymentId(
        sessionId
    );

    if (paymentExist) {
        throw new Error("Payment already exists");
    }

    const plan = await PlansController.getPlanById(metadata.planId);

    if (!plan) {
        throw new Error("Invalid plan");
    }

    await PaymentsController.savePayment(
        parseInt(metadata.userId),
        plan.id,
        sessionId
    );

    await AnnoncesController.updateAnnonce(parseInt(metadata.annonceId), {
        status: "paid",
        expirationDate: new Date(
            new Date().getTime() + plan.duration * 24 * 60 * 60 * 1000
        ),
    });

    return true;
}
