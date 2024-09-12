import { useEffect, useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useAnime } from "../hooks/useAnime";
import { useAuth } from "../hooks/useAuth";

import { Anime } from "../types/Anime";
import { User } from "../types/User";
import AnimeCard from "../components/AnimeCard";
import ReactPaginate from "react-paginate";
import AnimeFilter from "../components/AnimeFilter";
import ScrollTop from "../components/ScrollTop";

interface HomePageProps {
    data: Anime[];
    user: User | null;
}

const Home: NextPage<HomePageProps> = (props) => {
    const { requestAuthPermission, logout } = useAuth();

    const [animes, setAnimes] = useState<Anime[]>(props.data);
    const [reversed, setReversed] = useState<boolean>(false);
    const [sliceIndex, setSliceIndex] = useState<number>(0);
    const [totalPages, setTotalPages] = useState(0);

    const sliceCount = 15;

    useEffect(() => {
        setTotalPages(Math.ceil(props.data.length / sliceCount));
        console.log(props.user);
    }, [props.data]);

    const handlePageClick = (event: any) => {
        setSliceIndex(parseInt(event.selected) * sliceCount);
        window.scrollTo({ top: 0 });
    };

    return (
        <>
            <div className="w-full py-4 bg-sky-600 text-white flex flex-col md:flex-row justify-between items-center shadow-lg px-10">
                <h1 className="text-white text-xl font-bold mb-4 md:mb-0">MALite 2</h1>
                <AnimeFilter
                    data={props.data}
                    setAnimes={setAnimes}
                    setSliceIndex={setSliceIndex}
                    setTotalPages={setTotalPages}
                    sliceCount={sliceCount}
                    reversed={reversed}
                />
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
                {animes.length == 0 && <p className="text-center">-no anime found-</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {animes.slice(sliceIndex, sliceIndex + sliceCount).map((anime) => (
                        <AnimeCard key={anime.id} anime={anime} />
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
                {!props.user ? (
                    <div className="flex flex-col">
                        <p className="text-center text-lg font-semibold">Login to view your list</p>
                        <button
                            onClick={requestAuthPermission}
                            className="mt-2 self-center items-center text-white bg-sky-600 hover:bg-sky-700 rounded-md text-sm px-4 py-2"
                        >
                            Login with MAL
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <p className="text-center text-lg font-semibold">logged in as {props.user.name}</p>
                        <button
                            onClick={logout}
                            className="mt-2 self-center items-center text-white bg-red-600 hover:bg-red-700 rounded-md text-sm px-4 py-2"
                        >
                            Logout <i className="fa-solid fa-right-from-bracket ml-2"></i>
                        </button>
                    </div>
                )}
                <p className="text-gray-400 text-sm mt-4 text-center">@copyright joshua william - 2024</p>
            </div>
            <ScrollTop />
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { getUserAnimeList } = useAnime();
    const { authorize } = useAuth();

    const props: HomePageProps = { data: [], user: null };

    const user = await authorize(context.req.cookies.auth);

    if (user) {
        try {
            const res = await getUserAnimeList(user.token);
            props.data = res.data;
        } catch (e: any) {
            console.error(e.response?.data || e.message);
        }
        props.user = user;
    }

    return { props };
};

export default Home;
