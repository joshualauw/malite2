/* eslint-disable @next/next/no-img-element */
import { Anime } from "../types/Anime";
import dayjs from "dayjs";

function AnimeCard({ anime }: { anime: Anime }) {
    const getStatusFormat = (status: string) => {
        let base_class = "font-medium me-2 px-2.5 py-0.5 rounded-full text-xs ml-2 ";

        if (status == "completed") base_class += "bg-blue-100 text-blue-800";
        if (status == "watching") base_class += "bg-sky-100 text-sky-800";
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
        <div className="rounded-md p-4 border-2">
            <div className="flex items-start space-x-4">
                <a className="w-[150px] h-full" href={link} target="_blank" rel="noreferrer">
                    <img
                        src={anime.picture}
                        className="w-full h-full object-cover bg-center cursor-pointer hover:brightness-90"
                        alt={anime.title}
                    />
                </a>
                <div className="text-gray-500 w-full">
                    <a href={link} target="_blank" rel="noreferrer" className="font-semibold hover:underline">
                        {anime.title}
                    </a>
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
                <i className="fa-solid fa-pen-to-square text-gray-600 cursor-pointer brightness-90"></i>
            </div>
        </div>
    );
}

export default AnimeCard;
