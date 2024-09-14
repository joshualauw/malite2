/* eslint-disable @next/next/no-img-element */
import { Card } from "primereact/card";
import { Anime } from "../types/Anime";
import dayjs from "dayjs";
import { Dispatch, SetStateAction } from "react";

interface AnimeCardProps {
    anime: Anime;
    setEditing: Dispatch<SetStateAction<Anime>>;
}

function AnimeCard({ anime, setEditing }: AnimeCardProps) {
    const getStatusFormat = (status: string) => {
        let base_class = "font-medium me-2 px-2.5 py-0.5 rounded-full text-xs ml-2 ";

        if (status == "completed") base_class += "bg-blue-100 text-blue-800";
        if (status == "watching") base_class += "bg-green-100 text-green-800";
        if (status == "on_hold") base_class += "bg-yellow-100 text-yellow-800";
        if (status == "plan_to_watch") base_class += "bg-gray-100 text-gray-800";
        if (status == "dropped") return (base_class += "bg-red-100 text-red-800 ");

        return base_class;
    };

    function formatDate(date: string) {
        return date != "-" ? dayjs(anime.finished_date).format("DD MMM YYYY") : "-";
    }

    const link = `https://myanimelist.net/anime/${anime.id}`;

    return (
        <Card className="relative group">
            <div className="flex items-start space-x-4">
                <img src={anime.picture} className="w-[100px] h-[140px] object-cover bg-center" alt={anime.title} />
                <div className="text-gray-500 w-full">
                    <a href={link} target="_blank" rel="noreferrer" className="font-semibold hover:underline">
                        {anime.title}
                    </a>
                    <p className="text-sm text-gray-400">{anime.alternative_title ?? "-"}</p>
                    <p className="mt-3">Finished: {formatDate(anime.finished_date)}</p>
                    <div className="flex items-center">
                        Score:
                        <i className="fa-solid fa-star text-yellow-400 text-sm ml-2 mr-1"></i>
                        {anime.score}
                    </div>
                    <div>
                        Status:
                        <span className={getStatusFormat(anime.status)}>{anime.status}</span>
                    </div>
                </div>
            </div>
            <i
                onClick={() => setEditing(anime)}
                className="fa-solid fa-pen-to-square text-gray-500 cursor-pointer brightness-90 absolute right-4 top-4 
                opacity-0 group-hover:opacity-100"
            ></i>
        </Card>
    );
}

export default AnimeCard;
