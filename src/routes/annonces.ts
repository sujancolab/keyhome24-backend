import Router, { error, t } from "elysia";

import { session } from "@Middlewares/sessionMiddleware";

import AnnoncesController from "@Controllers/AnnoncesController";
import PlansController from "@Controllers/PlansController";

import { payForUpload, handlePaymentSuccess } from "@Services/stripe";

const annoncesRouter = new Router();

annoncesRouter.get("/annonces", async () => {
    const annonces = await AnnoncesController.getAnnonces();
    return annonces;
});

annoncesRouter.get(
    "/annonces/:id",
    async ({ params }) => {
        const { id } = params;
        const annonce = await AnnoncesController.getAnnonceById(Number(id));
        return annonce;
    },
    {
        params: t.Object({
            id: t.Number(),
        }),
    }
);

annoncesRouter.get(
    "/annonces/@me",
    async ({ user }: { user: { id: number } }) => {
        const annonces = await AnnoncesController.getAnnoncesByUserId(user.id);
        return annonces;
    },
    {
        beforeHandle: session as any,
        headers: t.Object({
            authorization: t.String(),
        }),
    }
);

annoncesRouter.post(
    "/annonces",
    async ({
        body,
        user,
    }: {
        body: {
            type: string;
            category: string;
            propertyType: string;
            title: string;
            description: string;
            price: number;
            location: {
                address: string;
                city: string;
                postalCode: string;
                canton: string;
            };
            features: {
                area: number;
                rooms: number;
                bathrooms: number;
                floor: number;
                totalFloors: number;
                parkingSpaces: number;
            };
            images: string[];
            subscriptionPlan: string;
        };
        user: { id: number };
    }) => {
        const {
            type,
            category,
            propertyType,
            title,
            description,
            price,
            location,
            features,
            images,
            subscriptionPlan,
        } = body;

        const plan = await PlansController.getPlanById(subscriptionPlan);

        if (!plan) {
            throw error(400, { errors: [{ message: "Invalid Plan." }] });
        }

        const annonce = await AnnoncesController.createAnnonce(
            category,
            type,
            propertyType,
            title,
            description,
            price,
            features.rooms,
            features.bathrooms,
            features.area,
            location,
            features,
            images,
            user.id,
            subscriptionPlan
        );

        const paymentLink = await payForUpload(
            annonce.id,
            subscriptionPlan,
            user.id
        );

        return { stripe_url: paymentLink };
    },
    {
        beforeHandle: session as any,
        body: t.Object({
            type: t.String(),
            category: t.String(),
            propertyType: t.String(),
            title: t.String(),
            description: t.String(),
            price: t.Number(),
            location: t.Object({
                address: t.String(),
                city: t.String(),
                postalCode: t.String(),
                canton: t.String(),
            }),
            features: t.Object({
                area: t.Number(),
                rooms: t.Number(),
                bathrooms: t.Number(),
                floor: t.Number(),
                totalFloors: t.Number(),
                parkingSpaces: t.Number(),
            }),
            subscriptionPlan: t.String(),
            images: t.Array(t.String()),
        }),
        headers: t.Object({
            authorization: t.String(),
        }),
    }
);

annoncesRouter.get(
    "/annonces/success/:sessionId",
    async ({ params }) => {
        const { sessionId } = params;
        const valid = await handlePaymentSuccess(sessionId);

        if (!valid) {
            throw error(400, { errors: [{ message: "Invalid Payment." }] });
        }

        return { message: "Payment Successful." };
    },
    {
        beforeHandle: session as any,
        params: t.Object({
            sessionId: t.String(),
        }),
        headers: t.Object({
            authorization: t.String(),
        }),
    }
);

export default annoncesRouter;
