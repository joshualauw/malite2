import { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { useAnime } from "../hooks/useAnime";
import { useAuth } from "../hooks/useAuth";

import { Anime } from "../types/Anime";
import { User } from "../types/User";
import { Button } from "primereact/button";
import { Paginator } from "primereact/paginator";
import AnimeCard from "../components/AnimeCard";
import AnimeFilter from "../components/AnimeFilter";
import ScrollTop from "../components/ScrollTop";
import EditAnime from "../components/EditAnime";

interface HomePageProps {
    data: Anime[];
    user: User | null;
}

const Home: NextPage<HomePageProps> = (props) => {
    const { requestAuthPermission, logout } = useAuth();

    const [animes, setAnimes] = useState<Anime[]>([]);
    const [reversed, setReversed] = useState<boolean>(false);
    const [sliceIndex, setSliceIndex] = useState<number>(0);
    const [modal, setModal] = useState<boolean>(false);
    const [editing, setEditing] = useState<Anime | null>(null);

    const sliceCount = 15;

    const handlePageClick = (event: any) => {
        setSliceIndex(parseInt(event.page) * sliceCount);
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
                    sliceCount={sliceCount}
                    reversed={reversed}
                />
            </div>
            <div className="m-6 md:m-8 space-y-8">
                <div className="flex items-center justify-between">
                    <p className="font-bold text-xl">{animes.length} records</p>
                    <div className="space-x-4">
                        {props.user && (
                            <Button
                                onClick={() => setModal(true)}
                                icon="fa-solid fa-plus"
                                label="Add"
                                size="small"
                                className="bg-zinc-50"
                                outlined
                            />
                        )}
                        <Button
                            onClick={() => setReversed(!reversed)}
                            icon="fa-solid fa-arrows-up-down"
                            label="reverse"
                            size="small"
                            className="bg-sky-600"
                        />
                    </div>
                </div>
                {animes.length == 0 && <p className="text-center">-no anime found-</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mx-0 md:mx-10 xl:mx-20">
                    {animes.slice(sliceIndex, sliceIndex + sliceCount).map((anime) => (
                        <AnimeCard key={anime.id} anime={anime} setEditing={setEditing} />
                    ))}
                </div>
                <Paginator
                    first={sliceIndex}
                    rows={sliceCount}
                    totalRecords={animes.length}
                    onPageChange={handlePageClick}
                    className="bg-slate-50"
                />
                {!props.user ? (
                    <div className="flex flex-col items-center">
                        <p className="text-center text-lg font-semibold">Login to view your list</p>
                        <Button
                            onClick={requestAuthPermission}
                            className="w-fit mt-3 bg-sky-600"
                            label="Login with MAL"
                            size="small"
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <p className="text-center text-lg font-semibold">logged in as {props.user.name}</p>
                        <Button
                            onClick={logout}
                            className="w-fit mt-3"
                            label="Logout"
                            severity="danger"
                            size="small"
                            icon="fa-solid fa-right-from-bracket"
                        />
                    </div>
                )}
                <p className="text-gray-400 text-sm mt-4 text-center">@copyright joshua william - 2024</p>
            </div>
            <ScrollTop />
            <EditAnime
                modal={modal}
                setModal={setModal}
                ownedAnimes={props.data}
                editing={editing}
                setEditing={setEditing}
            />
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { getUserAnimeList } = useAnime();
    const { authorize, getMe } = useAuth();

    const props: HomePageProps = {
        data: [],
        user: null,
    };

    const token = authorize(context.req.cookies.auth);

    try {
        const res = await getUserAnimeList(token);
        if (res.status == 200 && res.data) {
            props.data = res.data;
        }
    } catch (e: any) {
        console.error(e.response?.data || e.message);
    }

    try {
        const res = await getMe(token);
        if (res.status == 200 && res.data) {
            props.user = res.data;
        }
    } catch (e: any) {
        console.error(e.response?.data || e.message);
    }

    return { props };
};

export default Home;
