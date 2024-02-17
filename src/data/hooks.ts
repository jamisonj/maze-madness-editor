/**
 * hooks.ts: hooks for loading default maze data.
 */

import React from 'react';

/**
 * Downloads maze data from a .he8 file at a remote URL.
 * @param url the URL from which to load maze data.
 * @returns array buffer on success; error message on failure.
 */
export function useMazeData(url?: string) {
    const [data, setData] = React.useState<ArrayBuffer | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    React.useEffect(() => {
        fetch(url || "assets/maze.he8")
            .then(data => data.arrayBuffer())
            .then(setData)
            .catch(e => setError(e));
    }, [url]);
    return { data, error };
}
