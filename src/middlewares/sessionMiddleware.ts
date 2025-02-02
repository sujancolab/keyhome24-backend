import { Context as ElysiaContext } from "elysia";

type JwtType = {
    verify: (token: string) => Promise<any>;
};

interface Context extends ElysiaContext {
    jwt: JwtType;
    user: {
        id: number;
    };
}

export const session = async ({
    jwt,
    error,
    headers,
}: Context): Promise<any> => {
    const token = headers["authorization"] as string | undefined;
    if (!token) {
        return error(401, { message: "401: Unauthorized" });
    }

    const payload = await jwt.verify(token as string);
    if (!payload) {
        return error(401, { message: "401: Unauthorized" });
    }
};
