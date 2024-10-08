import type { NextApiRequest, NextApiResponse } from "next";
import { useAuth } from "../../hooks/useAuth";
import { AxiosError } from "axios";
import Cookies from "cookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { login } = useAuth();
    const cookies = new Cookies(req, res);

    if (req.method == "GET") {
        try {
            const result = await login(req.query.code as string);
            if (result.data) {
                cookies.set("auth", JSON.stringify(result.data), { httpOnly: true });
            }
        } catch (e: any) {
            if (e instanceof AxiosError) {
                console.error(e.response?.data || e.message);
            }
        }
        res.status(308).redirect(process.env.BASE_URL);
    }

    if (req.method == "PUT") {
        res.setHeader("Set-Cookie", "auth=; Max-Age=0; path=/;");
        cookies.set("auth", JSON.stringify(req.body), { httpOnly: true });

        res.status(200).json("token refreshed");
    }

    if (req.method == "DELETE") {
        res.setHeader("Set-Cookie", "auth=; Max-Age=0; path=/;");
        res.end();
    }
}
