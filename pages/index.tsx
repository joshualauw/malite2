/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { GetStaticProps, NextPage } from "next";
import axios from "axios";
import Anime from "../types/Anime";

const Home: NextPage<{ animes: Anime[]; message: string }> = (props) => {
    //
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortTerm, setSortTerm] = useState<string>("Title");
    const [filterTerm, setFilterTerm] = useState<string>("All");
    const [reversed, setReversed] = useState<boolean>(false);
    const [sliceIndex, setSliceIndex] = useState<number>(0);
    const [scrollable, setScrollable] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    const sliceCount = 20;

    useEffect(() => {
        window.onscroll = function () {
            if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
                setScrollable(true);
            } else {
                setScrollable(false);
            }
        };
    });

    const scrollToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const handlePrev = () => {
        if (page > 1) {
            setSliceIndex(sliceIndex - sliceCount);
            setPage(page - 1);
            window.scrollTo({ top: 0 });
        }
    };

    const handleNext = () => {
        if (sliceIndex + sliceCount <= sorted.length) {
            setSliceIndex(sliceIndex + sliceCount);
            setPage(page + 1);
            window.scrollTo({ top: 0 });
        }
    };

    const toMal = async (id: number) => {
        const res = await axios.get("https://api.jikan.moe/v4/anime/" + id);
        window.open(res.data.data.url, "_blank");
    };

    const getStatusFormat = (status: string) => {
        if (status == "completed") return { color: "text-blue-500", text: "completed" };
        if (status == "watching") return { color: "text-green-500", text: "watching" };
        if (status == "on_hold") return { color: "text-yellow-500", text: "on hold" };
        if (status == "plan_to_watch") return { color: "text-gray-400", text: "plan to watch" };
        if (status == "dropped") return { color: "text-red-500", text: "dropped" };
    };

    let sorted = [] as Anime[];
    sorted.push(...props.animes);
    sorted = sorted
        .filter((a) => {
            if (filterTerm != "All") {
                return a.status == filterTerm;
            } else {
                return 1;
            }
        })
        .filter((a) => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortTerm == "Title") {
                return 0;
            } else if (sortTerm == "score") {
                return b.score - a.score;
            } else {
                let aa = a.finished_date.split("/").reverse().join(),
                    bb = b.finished_date.split("/").reverse().join();
                return aa > bb ? -1 : aa < bb ? 1 : 0;
            }
        });
    if (reversed) sorted = sorted.reverse();

    return (
        <>
            <div
                onClick={() => scrollToTop()}
                className={`${
                    scrollable ? "flex" : "hidden"
                } fixed w-16 h-16 right-6 bottom-6 bg-sky-600 text-white rounded-full flex justify-center items-center z-20 cursor-pointer transition-all duration-200 hover:bg-sky-700`}
            >
                <i className="fa-sharp fa-solid fa-arrow-up fa-lg"></i>
            </div>
            <div className="w-full py-4 bg-sky-600 text-white flex flex-col md:flex-row justify-between items-center shadow-lg px-10">
                <h1 className="text-white text-xl font-bold mb-4 md:mb-0">MALITE 2</h1>
                <div className="flex flex-col md:flex-row justify-center items-center mb-4 md:mb-0 space-y-4 md:space-y-0 md:space-x-5">
                    <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            type="text"
                            value={searchTerm}
                            onInput={(e) => {
                                setSearchTerm(e.currentTarget.value);
                                setPage(1);
                                setSliceIndex(0);
                            }}
                            className="rounded-full px-3 py-1.5 md:py-1 outline-none w-80 md:w-64 text-gray-700"
                            placeholder="Search anime in my list..."
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-bars"></i>
                        <select
                            onInput={(e) => {
                                setFilterTerm(e.currentTarget.value);
                                setPage(1);
                                setSliceIndex(0);
                            }}
                            className="rounded-full px-3 py-1.5 md:py-1 outline-none w-80 md:w-36 text-gray-700"
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
                                setPage(1);
                                setSliceIndex(0);
                            }}
                            className="rounded-full px-3 py-1.5 md:py-1 outline-none w-80 md:w-36 text-gray-700"
                        >
                            <option defaultValue="title">Title</option>
                            <option value="score">Score</option>
                            <option value="date">Date</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="m-6 md:m-8 space-y-8">
                <div className="flex items-center justify-between">
                    <p className="font-bold text-xl">{sorted.length} records found</p>
                    <button
                        onClick={() => setReversed(!reversed)}
                        className="px-5 py-2 rounded-full bg-sky-600 text-white cursor-pointer hover:bg-sky-700 transition-all duration-200"
                    >
                        <i className="fa-solid fa-arrows-up-down"></i> reverse
                    </button>
                </div>
                <div className="space-y-5">
                    {sorted.slice(sliceIndex, sliceIndex + sliceCount).map((a) => {
                        const status = getStatusFormat(a.status);
                        return (
                            <div
                                key={a.id}
                                onClick={() => toMal(a.id)}
                                className="rounded-lg bg-slate-100 p-5 mb-5 cursor-pointer hover:translate-y-1"
                            >
                                <div className="flex items-center justify-start space-x-5">
                                    <img src={a.picture} className="w-20 h-full rounded-sm" alt={a.title} />
                                    <div>
                                        <p className="font-semibold">{a.title}</p>
                                        <p className="text-gray-500">{a.finished_date}</p>
                                        <p>
                                            Score: <i className="fa-solid fa-star text-yellow-400"></i>
                                            {a.score}
                                        </p>
                                        <div className="flex items-center mt-2 space-x-3">
                                            <p>
                                                Status:
                                                <span className={`${status.color} font-semibold`}> {status.text}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center items-center space-x-4">
                    <button
                        onClick={() => handlePrev()}
                        className="px-5 py-2 rounded-full bg-sky-600 text-white cursor-pointer hover:bg-sky-700 transition-all duration-200"
                    >
                        <i className="fa-solid fa-chevron-left"></i> prev
                    </button>
                    <p className="text-lg font-semibold">{page}</p>
                    <button
                        onClick={() => handleNext()}
                        className="px-5 py-2 rounded-full bg-sky-600 text-white cursor-pointer hover:bg-sky-700 transition-all duration-200"
                    >
                        <i className="fa-solid fa-chevron-right"></i> next
                    </button>
                </div>
                <div className="text-center text-gray-400 text-sm">
                    <p>@copyright joshua w - All rights reserved</p>
                    <p>Built using: Nextjs /w Incremental Static Generation</p>
                </div>
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async (context) => {
    try {
        const result = await axios.get(
            `https://api.myanimelist.net/v2/users/Winter_Fox/animelist?limit=1000&fields=list_status`,
            {
                headers: {
                    "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID,
                },
            }
        );
        const animes = result.data.data.map((d) => {
            return {
                id: d.node.id,
                title: d.node.title,
                picture: d.node.main_picture.medium,
                status: d.list_status.status,
                score: d.list_status.score,
                finished_date: d.list_status.finish_date ?? "-",
            };
        });
        return {
            props: {
                animes,
                message: "data fetch succesful",
            },
        };
    } catch (e: any) {
        return {
            props: {
                animes: [],
                message: "data fetch failed",
            },
            revalidate: 86400,
        };
    }
};

export default Home;
