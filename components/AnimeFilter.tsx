import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Anime } from "../types/Anime";

interface AnimeFilterProps {
    data: Anime[];
    setAnimes: Dispatch<SetStateAction<Anime[]>>;
    setSliceIndex: Dispatch<SetStateAction<number>>;
    sliceCount: number;
    reversed: boolean;
}

function AnimeFilter({ data, setAnimes, setSliceIndex, sliceCount, reversed }: AnimeFilterProps) {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortTerm, setSortTerm] = useState<string>("Date");
    const [filterTerm, setFilterTerm] = useState<string>("All");

    useEffect(() => {
        let filtered = data
            .filter((a) => {
                if (filterTerm != "All") {
                    return a.status == filterTerm;
                } else {
                    return 1;
                }
            })
            .filter((a) => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sortTerm == "title") {
                    return 0;
                } else if (sortTerm == "score") {
                    return b.score - a.score;
                } else {
                    let aa = a.finished_date.split("/").reverse().join(),
                        bb = b.finished_date.split("/").reverse().join();
                    return aa > bb ? -1 : aa < bb ? 1 : 0;
                }
            });

        if (reversed) {
            filtered = filtered.reverse();
        }

        setAnimes(filtered);
    }, [searchTerm, filterTerm, reversed, sortTerm, data, sliceCount]);

    return (
        <div className="flex flex-col md:flex-row justify-center items-center mb-4 md:mb-0 space-y-4 md:space-y-0 md:space-x-5">
            <div className="flex items-center space-x-2">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                    type="text"
                    value={searchTerm}
                    onInput={(e) => {
                        setSearchTerm(e.currentTarget.value);
                        setSliceIndex(0);
                    }}
                    className="rounded-full px-3 py-1 outline-none w-80 md:w-64 text-gray-700"
                    placeholder="Search anime in my list..."
                />
            </div>
            <div className="flex items-center space-x-2">
                <i className="fa-solid fa-bars"></i>
                <select
                    onInput={(e) => {
                        setFilterTerm(e.currentTarget.value);
                        setSliceIndex(0);
                    }}
                    className="rounded-full px-3 py-1 outline-none w-80 md:w-36 text-gray-700"
                >
                    <option defaultValue="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="watching">Watching</option>
                    <option value="on_hold">On-hold</option>
                    <option value="plan_to_watch">Plan to watch</option>
                    <option value="dropped">Dropped</option>
                </select>
            </div>
            <div className="flex items-center space-x-2">
                <i className="fa-solid fa-filter"></i>
                <select
                    onInput={(e) => {
                        setSortTerm(e.currentTarget.value);
                        setSliceIndex(0);
                    }}
                    className="rounded-full px-3 py-1 outline-none w-80 md:w-36 text-gray-700"
                >
                    <option defaultValue="date">Date</option>
                    <option value="title">Title</option>
                    <option value="score">Score</option>
                </select>
            </div>
        </div>
    );
}

export default AnimeFilter;
