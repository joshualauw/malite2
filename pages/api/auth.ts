import type { NextApiRequest, NextApiResponse } from "next";
import { useAuth } from "../../hooks/useAuth";
import { BASE_URL } from "../../const/api";
import Cookies from "cookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { login } = useAuth();
    const cookies = new Cookies(req, res);

    if (req.method == "GET") {
        try {
            const result = await login(req.query.code as string);
            if (result.data) {
                cookies.set("auth", JSON.stringify(result.data));
            }
        } catch (e: any) {
            console.error(e.response?.data || e.message);
        }
    }

    if (req.method == "DELETE") {
        res.setHeader("Set-Cookie", "auth=; Max-Age=0; path=/;");
    }

    res.status(308).redirect(BASE_URL);
}
