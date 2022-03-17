import {useCallback, useMemo, useState} from "react";

type CursorMap = Map<number, string>

interface ICursorValues {
    cursors: CursorMap,
    currentIndex: number,
    hasPrev: boolean,
    hasNext: boolean
}

interface ICursorController {
    addNextCursor: (val: string) => void
}

/* CursorManager handles logic to maintain an accurate map of cursors by page.
* Each time you append a cursor with `addNextCursor`, the manager will handle,
* duplicates and set your hasNext and hasPrev values for you. */
const useCursorManager = () => {
    const [cursors, setCursors] = useState<CursorMap>(
        new Map<number, string>([[0, ""]])
    );
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [hasPrev, setHasPrev] = useState<boolean>(false);
    const [hasNext, setHasNext] = useState<boolean>(false);

    /* Handles verifying cursor duplication */
    const cursorExists = useCallback(
        (c: string) => {
            return Array.from(cursors.values()).includes(c);
        },
        [cursors]
    );

    /* Private method for handling cursor addition since we may not always
    * want to just append a cursor. */
    const addCursor = (index: number, val: string) => {
        if (!cursorExists(val)) {
            setCursors(cursors.set(index, val))
        }
        setHasNext(cursors.get(currentIndex + 1) !== undefined)
        setHasPrev(cursors.get(currentIndex - 1) !== undefined)
    }

    /* Handles simple appending of new cursors to the end of the Map */
    const addNextCursor = (val: string) => {
        addCursor(cursors.size, val)
    }

    /* Returning values and controllers as objects to keep them clean */
    const values: ICursorValues = useMemo(() => {
        return {
            cursors: cursors,
            currentIndex: currentIndex,
            hasPrev: hasPrev,
            hasNext: hasNext
        }
    }, [cursors, currentIndex, hasPrev, hasNext])

    const controller: ICursorController = {
        addNextCursor: addNextCursor,
    }

    return { values, controller };
};

export default useCursorManager;
