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
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    if (!scrollable) return <></>;

    return (
        <button
            onClick={scrollToTop}
            className="fixed w-12 h-12 right-6 bottom-6 bg-sky-600 text-white rounded-full flex justify-center items-center z-50  hover:bg-sky-700"
        >
            <i className="fa-sharp fa-solid fa-arrow-up"></i>
        </button>
    );
}

export default ScrollTop;
