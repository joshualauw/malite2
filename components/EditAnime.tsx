import { Dialog } from "primereact/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAnime } from "../hooks/useAnime";
import { Anime, AnimeKeyword } from "../types/Anime";
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import dayjs from "dayjs";

interface EditAnimeProps {
    modal: boolean;
    setModal: Dispatch<SetStateAction<boolean>>;
    editing: Anime | null;
    setEditing: Dispatch<SetStateAction<Anime | null>>;
    ownedAnimes: Anime[];
}

function EditAnime({ modal, setModal, setEditing, editing, ownedAnimes }: EditAnimeProps) {
    const { getAnimeByKeyword, updateAnime, deleteAnime } = useAnime();
    const [animes, setAnimes] = useState<AnimeKeyword[]>([]);
    const [selected, setSelected] = useState<AnimeKeyword | null>(null);
    const [score, setScore] = useState<number>(0);
    const [status, setStatus] = useState<string>("watching");
    const [owned, setOwned] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [finishDate, setFinishDate] = useState<Date>(dayjs().toDate());

    const statusOptions = ["watching", "on_hold", "dropped", "completed", "plan_to_watch"];

    useEffect(() => {
        if (!modal) {
            setSelected(null);
            setScore(0);
            setStatus("watching");
            setFinishDate(dayjs().toDate());

            setOwned(false);
            setEditing(null);
            setLoading(false);
        }
    }, [modal]);

    useEffect(() => {
        if (editing) {
            setSelected({ id: editing.id, title: editing.title, picture: editing.picture });
            setModal(true);
            setScore(editing.score);
            setStatus(editing.status);
            setFinishDate(dayjs(editing.finished_date).toDate());
        }
    }, [editing]);

    async function getAnimeSuggestion(e: AutoCompleteCompleteEvent) {
        const res = await getAnimeByKeyword(e.query);
        if (res.status == 200 && res.data) {
            setAnimes(res.data);
        }
    }

    function selectAnimeSuggestion(e: AutoCompleteSelectEvent) {
        setOwned(false);
        setSelected(e.value);

        const idx = ownedAnimes.findIndex((a) => a.id == e.value.id);
        if (idx != -1) {
            setOwned(true);
        }
    }

    async function save() {
        if (selected == null) return;

        setLoading(true);
        const res = await updateAnime(selected.id, {
            score,
            status,
            finish_date: dayjs(finishDate).format("YYYY-MM-DD"),
        });

        if (res.status == 201) {
            setModal(false);
            window.location.reload();
        }
    }

    async function remove() {
        const confirmed = confirm("are you sure?");

        if (confirmed) {
            setLoading(true);
            const res = await deleteAnime(selected.id);

            if (res.status == 201) {
                setModal(false);
                window.location.reload();
            }
        }
    }

    return (
        <Dialog
            header="Add Anime"
            visible={modal}
            className="w-[400px] md:w-[500px] xl:w-[600px]"
            draggable={false}
            onHide={() => setModal(false)}
        >
            {!editing && (
                <div className="flex items-center">
                    <i className="fas fa-search mr-3 text-lg"></i>
                    <AutoComplete
                        suggestions={animes}
                        field="title"
                        minLength={3}
                        onSelect={selectAnimeSuggestion}
                        completeMethod={getAnimeSuggestion}
                        placeholder="Input anime title... (min 3 character)"
                        delay={600}
                        panelClassName="max-w-[300px]"
                        inputClassName="w-full"
                        className="w-full mt-2"
                    />
                </div>
            )}

            {selected && (
                <div className="p-4 border-2 rounded-sm mt-5 flex items-center space-x-4 bg-zinc-50">
                    <img
                        src={selected.picture}
                        className="w-[60px] h-[90px] object-cover bg-center"
                        alt={selected.title}
                    />
                    <div>
                        <a
                            href={`https://myanimelist.net/anime/${selected.id}`}
                            target="_blank"
                            className="font-bold text-lg hover:underline"
                        >
                            {selected.title}
                        </a>
                        <p className="text-gray-500">id: {selected.id}</p>
                        {owned && <p className="text-red-500">-you own this anime in your list-</p>}
                    </div>
                </div>
            )}

            {selected && (
                <div className="space-y-4 mt-8">
                    <div>
                        <span>Score: ({score}/10)</span>
                        <Rating
                            value={score}
                            onChange={(e) => setScore(e.value)}
                            stars={10}
                            cancel={false}
                            className="inline-flex ml-4"
                        />
                    </div>
                    <div>
                        <div className="mb-2">Status:</div>
                        <Dropdown
                            value={status}
                            onChange={(e) => setStatus(e.value)}
                            options={statusOptions}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <div className="mb-2">Finished Date:</div>
                        <Calendar value={finishDate} onChange={(e) => setFinishDate(e.value)} className="w-full" />
                    </div>
                </div>
            )}

            <div className="space-x-3 mt-8 float-right">
                <Button onClick={save} size="small" label="Save" loading={loading} className="bg-sky-500" />
                <Button
                    onClick={() => setModal(false)}
                    size="small"
                    severity="danger"
                    label="Cancel"
                    icon="fa-solid fa-times"
                    outlined
                />
                {editing && (
                    <Button
                        onClick={remove}
                        size="small"
                        label="Delete"
                        loading={loading}
                        severity="danger"
                        icon="fas fa-trash"
                    />
                )}
            </div>
        </Dialog>
    );
}

export default EditAnime;
