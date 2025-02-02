import Router, { error, t } from "elysia";

import { session } from "@Middlewares/sessionMiddleware";

import UsersController from "@Controllers/UsersController";

const usersRouter = new Router();

usersRouter.get(
    "/users/:id",
    async ({ params }) => {
        const { id } = params;
        const user = await UsersController.getUserById(Number(id));
        return user;
    },
    {
        params: t.Object({
            id: t.Number(),
        }),
    }
);

export default usersRouter;
