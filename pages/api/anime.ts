import { NextApiRequest, NextApiResponse } from "next";
import { AxiosError } from "axios";
import $axios from "../../lib/axios";
import { useAuth } from "../../hooks/useAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { authorize } = useAuth();

    if (req.method == "GET") {
        try {
            const result = await $axios.get(`/anime`, {
                baseURL: process.env.MAL_URL,
                params: {
                    q: req.query.query,
                    limit: 10,
                },
            });

            if (result.status == 200 && result.data) {
                result.data = result.data.data.map((d) => ({
                    id: d.node.id,
                    title: d.node.title,
                    picture: d.node.main_picture.medium,
                }));
            }
            return res.status(200).json(result.data);
        } catch (e: any) {
            if (e instanceof AxiosError) {
                console.error(e.response.data || e.message);
                return res.status(e.response.status).json(e.message);
            }
            return res.status(500).json("something went wrong");
        }
    }

    if (req.method == "POST") {
        try {
            const token = authorize(req.cookies["auth"]);

            const params = new URLSearchParams();
            params.append("status", req.body.status);
            params.append("score", req.body.score);
            if (req.body.finish_date) params.append("finish_date", req.body.finish_date);

            const result = await $axios.patch(`/anime/${req.query.anime_id}/my_list_status`, params, {
                baseURL: process.env.MAL_URL,
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/x-www-form-urlencoded" },
            });

            return res.status(201).json(result.data);
        } catch (e: any) {
            if (e instanceof AxiosError) {
                console.error(e.response.data || e.message);
                return res.status(e.response.status).json(e.message);
            }
            return res.status(500).json("something went wrong");
        }
    }

    if (req.method == "DELETE") {
        try {
            const token = authorize(req.cookies["auth"]);

            const result = await $axios.delete(`/anime/${req.query.anime_id}/my_list_status`, {
                baseURL: process.env.MAL_URL,
                headers: { Authorization: `Bearer ${token}` },
            });

            return res.status(201).json(result.data);
        } catch (e: any) {
            if (e instanceof AxiosError) {
                console.error(e.response.data || e.message);
                return res.status(e.response.status).json(e.message);
            }
            return res.status(500).json("something went wrong");
        }
    }
}
