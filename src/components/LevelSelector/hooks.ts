import React, { useCallback } from 'react';
import { LevelSetState } from '../../reducers';
import { LevelSetAction, LevelSetActions } from '../../reducers/levelSet';

export const ROOMS = [ "Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "Bonus Room" ];

/**
 * Creates an array of toggleable booleans and a callback for toggling individual ones.
 * @param length the number of items in the array.
 * @param defaultValue the default value for each item.
 * @returns the array of values and a callback for toggling an individual value at an index.
 */
export function useToggleable(length: number, defaultValue: boolean = true) {
    const [values, setValues] = React.useState([ ...Array(length) ].map(x => defaultValue));
    const toggle = React.useCallback((index: number, value?: boolean) => setValues([
        ...values.slice(0, index),
        (value === undefined ? !values[index] : value),
        ...values.slice(index + 1)
    ]), [values]);
    return [values, toggle] as [boolean[], (index: number, value?: boolean) => void];
}

/**
 * Creates a callback which can be used to select a level and room for editing.
 * @param state the current state of the 50-level set.
 * @param dispatch dispatcher to update the current state.
 * @returns a callback which will update the selected level and room.
 */
export function useLevelSelection(state: LevelSetState, dispatch: React.Dispatch<LevelSetAction>) {
    return useCallback((level: number, room?: number) => {
        dispatch({
            type: LevelSetActions.SelectLevel,
            level,
            room: room === undefined ? state.selectedRoom : room
        });
    }, [state, dispatch]);
}
