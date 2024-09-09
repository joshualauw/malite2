/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import Anime from "../types/Anime";
import dayjs from "dayjs";

function AnimeCard({ anime }: { anime: Anime }) {
    const toMal = async (id: number) => {
        const res = await axios.get("https://api.jikan.moe/v4/anime/" + id);
        window.open(res.data.data.url, "_blank");
    };

    const getStatusFormat = (status: string) => {
        let base_class = "font-medium me-2 px-2.5 py-0.5 rounded-full text-xs ml-2 ";

        if (status == "completed") base_class += "bg-blue-100 text-blue-800";
        if (status == "watching") base_class += "bg-green-100 text-green-800";
        if (status == "on_hold") base_class += "bg-yellow-100 text-yellow-800";
        if (status == "plan_to_watch") base_class += "bg-gray-100 text-gray-800";
        if (status == "dropped") return (base_class += "bg-red-100 text-red-800 ");

        return base_class;
    };

    return (
        <div className="rounded-md p-4 border-2">
            <div className="flex items-start space-x-4">
                <img
                    src={anime.picture}
                    className="w-[100px] h-full object-cover bg-center"
                    alt={anime.title}
                />
                <div className="text-gray-500 w-full">
                    <p className="font-semibold mb-3">{anime.title}</p>
                    <p>Finished: {dayjs(anime.finished_date).format("DD MMM YYYY")}</p>
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
                <button onClick={() => toMal(anime.id)}>
                    <i className="fa-solid fa-arrow-up-right-from-square text-sm text-gray-500"></i>
                </button>
            </div>
        </div>
    );
}

export default AnimeCard;
