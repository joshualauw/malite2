export interface Anime {
    id: number;
    title: string;
    alternative_title: string | null;
    status: string;
    score: number;
    finished_date: string;
    picture: string;
}

export type AnimeKeyword = Pick<Anime, "id" | "title" | "picture">;

export interface EditAnimeInput {
    score: number;
    status: string;
    finish_date: string | null;
}
