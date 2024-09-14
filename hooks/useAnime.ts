import { AxiosResponse } from "axios";
import { BASE_URL, MAL_URL } from "../const/api";
import { Anime, AnimeKeyword, EditAnimeInput } from "../types/Anime";
import $axios from "../lib/axios";

export function useAnime(limit: number = 1000) {
    async function getUserAnimeList(token: string): Promise<AxiosResponse<Anime[]>> {
        const res = await $axios.get(`/users/@me/animelist`, {
            baseURL: MAL_URL,
            params: {
                limit,
                fields: "list_status,alternative_titles,comments",
            },
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status == 200 && res.data) {
            res.data = res.data.data.map((d) => ({
                id: d.node.id,
                title: d.node.title,
                alternative_title: d.node.alternative_titles.en,
                picture: d.node.main_picture.medium,
                status: d.list_status.status,
                score: d.list_status.score,
                finished_date: d.list_status.finish_date || "-",
            }));
        }

        return res;
    }

    async function updateAnime(anime_id: number, payload: EditAnimeInput) {
        return await $axios.post(`/api/anime`, payload, {
            baseURL: BASE_URL,
            params: { anime_id },
        });
    }

    async function deleteAnime(anime_id: number) {
        return await $axios.delete(`/api/anime`, {
            baseURL: BASE_URL,
            params: { anime_id },
        });
    }

    async function getAnimeByKeyword(query: string) {
        return await $axios.get<AnimeKeyword[]>(`/api/anime`, {
            baseURL: BASE_URL,
            params: { query },
        });
    }

    return { getUserAnimeList, getAnimeByKeyword, updateAnime, deleteAnime };
}
