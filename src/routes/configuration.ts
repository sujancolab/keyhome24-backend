import Router, { error, t } from "elysia";

import ConfigurationController from "../controllers/ConfigurationController";

const configurationRouter = new Router();

configurationRouter.get("/configuration", async () => {
    const configuration = await ConfigurationController.getConfiguration();
    return configuration;
});

export default configurationRouter;
