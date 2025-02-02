import Router, { error, t } from "elysia";

import { session } from "@Middlewares/sessionMiddleware";

import PlansController from "@Controllers/PlansController";

const plansRouter = new Router();

plansRouter.get("/plans", async () => {
    const plans = await PlansController.getPlans();
    return plans;
});

export default plansRouter;
