/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import axios from "axios";
import Anime from "../types/Anime";
import AnimeCard from "../components/AnimeCard";
import ReactPaginate from "react-paginate";

const Home: NextPage<{ data: Anime[]; message: string }> = (props) => {
    //
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortTerm, setSortTerm] = useState<string>("Date");
    const [filterTerm, setFilterTerm] = useState<string>("All");
    const [reversed, setReversed] = useState<boolean>(false);
    const [sliceIndex, setSliceIndex] = useState<number>(0);
    const [scrollable, setScrollable] = useState<boolean>(false);
    const [animes, setAnimes] = useState<Anime[]>(props.data);
    const [totalPages, setTotalPages] = useState(0);

    const sliceCount = 15;

    useEffect(() => {
        window.onscroll = function () {
            if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
                setScrollable(true);
            } else {
                setScrollable(false);
            }
        };
        setTotalPages(Math.ceil(props.data.length / sliceCount));
    }, [props.data.length]);

    const scrollToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const handlePageClick = (event: any) => {
        setSliceIndex(parseInt(event.selected) * sliceCount);

        window.scrollTo({ top: 0 });
    };

    useEffect(() => {
        let filtered = props.data
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
        setTotalPages(Math.ceil(filtered.length / sliceCount));
    }, [searchTerm, filterTerm, reversed, sortTerm, props.data]);

    return (
        <>
            <div className="w-full py-4 bg-sky-600 text-white flex flex-col md:flex-row justify-between items-center shadow-lg px-10">
                <h1 className="text-white text-xl font-bold mb-4 md:mb-0">MALite 2</h1>
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
            </div>
            <div className="m-6 md:m-8 space-y-8">
                <div className="flex items-center justify-between">
                    <p className="font-bold text-xl">{animes.length} records found</p>
                    <button
                        onClick={() => setReversed(!reversed)}
                        className="px-5 py-2 rounded-full bg-sky-600 text-white cursor-pointer hover:bg-sky-700 transition-all duration-200"
                    >
                        <i className="fa-solid fa-arrows-up-down"></i> reverse
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {animes.slice(sliceIndex, sliceIndex + sliceCount).map((a) => (
                        <AnimeCard key={a.id} anime={a} />
                    ))}
                </div>
                <ReactPaginate
                    breakLabel="..."
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={4}
                    pageCount={totalPages}
                    nextLabel=">"
                    previousLabel="<"
                    activeClassName="text-white bg-sky-500 hover:bg-sky-500"
                    containerClassName="flex"
                    pageLinkClassName="w-full flex justify-center items-center"
                    pageClassName="border w-10 h-10 flex justify-center items-center hover:bg-sky-50"
                    breakClassName="border w-10 h-10 flex justify-center items-center hover:bg-sky-50"
                    previousClassName="border w-10 h-10 flex justify-center items-center rounded-l-md hover:bg-sky-50"
                    nextClassName="border w-10 h-10 flex justify-center items-center rounded-r-md hover:bg-sky-50"
                />
                <div className="text-center text-gray-400 text-sm">
                    <p>@copyright joshua william - 2024</p>
                </div>
            </div>
            {scrollable && (
                <button
                    onClick={scrollToTop}
                    className="fixed w-12 h-12 right-6 bottom-6 bg-sky-600 text-white rounded-full flex justify-center items-center z-50  hover:bg-sky-700"
                >
                    <i className="fa-sharp fa-solid fa-arrow-up"></i>
                </button>
            )}
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const result = await axios.get(
            `https://api.myanimelist.net/v2/users/Winter_Fox/animelist`,
            {
                params: {
                    limit: 1000,
                    fields: "list_status",
                },
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
                data: animes,
                message: "data fetch succesful",
            },
        };
    } catch (e: any) {
        return {
            props: {
                data: [],
                message: "data fetch failed",
            },
        };
    }
};

export default Home;
