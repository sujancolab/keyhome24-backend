import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { jwt } from "@elysiajs/jwt";
import { jwtSecret } from "./config";

import authRouter from "@Routes/auth";
import annoncesRouter from "@Routes/annonces";
import plansRouter from "@Routes/plans";
import usersRouter from "@Routes/users";
import configurationRouter from "@Routes/configuration";

const app = new Elysia().use(swagger()).use(
    jwt({
        name: "jwt",
        secret: jwtSecret,
    })
);

app.use(cors({
    origin: ['https://keyhome24.com', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // Cache preflight requests for 24 hours
}));

app.derive(async ({ headers, jwt }) => {
    const token = headers["authorization"] ?? null;
    if (!token) return { user: null };

    const user = await jwt.verify(token);
    if (!user) return { user: null };
    return { user };
});

app.group("/api/v1", (api) => {
    api.use(authRouter);
    api.use(annoncesRouter);
    api.use(plansRouter);
    api.use(usersRouter);
    api.use(configurationRouter);

    return api;
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
