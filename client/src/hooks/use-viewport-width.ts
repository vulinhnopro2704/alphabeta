import { useCallback, useState } from "react";
const browser = typeof window !== "undefined"

// useViewportWidth is a custom hook that returns the width of the viewport use for responsive components.
export function useViewportWidth() {
    const [width, setWidth] = useState(browser ? window.innerWidth : 0);

    const setSize = useCallback(() => {
        setWidth(window.innerWidth || 0);
    }, []);


    window.addEventListener("resize", setSize, { passive: true });
    window.addEventListener("orientationChange", setSize, { passive: true });

    return width;
}