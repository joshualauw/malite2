import { AxiosResponse } from "axios";
import { MAL_URL } from "../const/api";
import $axios from "../lib/axios";
import { Anime } from "../types/Anime";

export function useAnime(limit: number = 1000) {
    async function getUserAnimeList(token: string): Promise<AxiosResponse<Anime[]>> {
        const res = await $axios.get(`/users/@me/animelist`, {
            baseURL: MAL_URL,
            params: {
                limit,
                fields: "list_status",
            },
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status == 200 && res.data) {
            res.data = res.data.data.map((d) => ({
                id: d.node.id,
                title: d.node.title,
                picture: d.node.main_picture.medium,
                status: d.list_status.status,
                score: d.list_status.score,
                finished_date: d.list_status.finish_date || "-",
            }));
        }
        return res;
    }

    return { getUserAnimeList };
}
