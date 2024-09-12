import { Button } from "primereact/button";
import { useEffect, useState } from "react";

function ScrollTop() {
    const [scrollable, setScrollable] = useState<boolean>(false);

    useEffect(() => {
        window.onscroll = function () {
            if (document.body.scrollTop > 1000 || document.documentElement.scrollTop > 1000) {
                setScrollable(true);
            } else {
                setScrollable(false);
            }
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!scrollable) return <></>;

    return (
        <Button
            onClick={scrollToTop}
            size="small"
            rounded
            className="fixed right-6 bottom-6 bg-sky-600 "
            icon="fa-solid fa-arrow-up"
        />
    );
}

export default ScrollTop;
