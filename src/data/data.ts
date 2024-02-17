/**
 * data.ts: utility functions for manipulating level data.
 */

import { LevelRoom, LevelSetState, SingleLevelState, currentState } from "../reducers/levelSet";

/**
 * Writes a 2D array of 16x11 shorts to an array buffer.
 * @param values the values to write.
 * @param buffer the buffer to write to.
 * @param pointer offset at which the first value should be written.
 * @returns the offset for the first byte after the final written byte.
 */
function writeValues(values: number[][], buffer: DataView, pointer: number) {
    for (let y = 0; y < 11; ++y) {
        for (let x = 0; x < 16; ++x) {
            buffer.setUint16(pointer, values[x][y], true);
            pointer += 2;
        }
    }
    return pointer;
}

/**
 * Writes a 2D array buffer containing 16x11 shorts to a second array buffer.
 * @param values the array buffer to write.
 * @param buffer the buffer to write to.
 * @param pointer offset at which the first value should be written.
 * @returns the offset for the first byte after the final written byte.
 */
function writeBuffer(values: DataView, buffer: DataView, pointer: number) {
    for (let x = 0; x < 353; ++x) {
        buffer.setUint16(pointer, values.getUint16(x * 2, true), true);
        pointer += 2;
    }
    return pointer;
}

/**
 * Writes data for a single room for a single level to an array buffer. If no buffer is passed, a new one will be created.
 * @param room room data to write.
 * @param buffer the array buffer to write to.
 * @param offset offset at which the first value should be written.
 * @returns array buffer containing the written values.
 */
export function writeRoom(room: LevelRoom, buffer?: ArrayBuffer, offset?: number): ArrayBuffer {
    if (buffer === undefined) buffer = new ArrayBuffer(706);
    const view = new DataView(buffer);
    let pointer = offset || 0;
    const levelState = currentState(room);
    if (levelState) {
        pointer = writeValues(levelState.lower, view, pointer);
        view.setUint16(pointer, levelState.background, true);
        pointer = writeValues(levelState.upper, view, pointer + 2);
    } else
        pointer = writeBuffer(new DataView(room.data), view, pointer);
    return buffer;
}

/**
 * Writes data for all six rooms a single level to an array buffer. If no buffer is passed, a new one will be created.
 * @param level level data to write.
 * @param buffer the array buffer to write to.
 * @param offset offset at which the first value should be written.
 * @returns array buffer containing the written values.
 */
export function writeLevel(level: SingleLevelState, buffer?: ArrayBuffer, offset?: number): ArrayBuffer {
    if (buffer === undefined) buffer = new ArrayBuffer(4236);
    const pointer = offset || 0;
    for (let room = 0; room < 6; ++room) {
        writeRoom(level[room], buffer, pointer + 706 * room);
    }
    return buffer;
}

/**
 * Writes data for all fifty levels to a new array buffer. When saved as a .he8 file, this becomes playable.
 * @param levelSet level set data to write.
 * @returns array buffer containing the written values.
 */
export function writeLevelSet(levelSet: LevelSetState): ArrayBuffer {
    const result = new ArrayBuffer(211800);
    for (let level = 0; level < 50; ++level) {
        writeLevel(levelSet.levels[level], result, 4236 * level);
    }
    return result;
}

/**
 * Opens a download dialog to save the contents of an array buffer to a file.
 * @param arrayBuffer the array buffer to save.
 * @param fileName default file name displayed in the dialog.
 */
export function saveArrayBufferToFile(arrayBuffer: ArrayBuffer, fileName: string) {
    const blob = new Blob([arrayBuffer]);
    const blobURL = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobURL;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(blobURL);
}

/**
 * Exectues a callback for every item/wall in a single room for a single level. The callback receives each uint16 data value once.
 * @param room the level room for which to execute the loop.
 * @param iterator callback to run for each value; receives the uint16 data code for each wall/item once.
 */
export function iterateLowerValues(room: LevelRoom, iterator: (value: number) => void) {
    if (!room) return;
    if (room.stateHistory === undefined) {
        const view = new DataView(room.data);
        for (let i = 0; i < 176; ++i) iterator(view.getUint16(i * 2, true));
    } else
        room.stateHistory[room.statePointer].lower.forEach(col => {
            col.forEach(iterator)
        });
}

/**
 * Exectues a callback for every decoration in a single room for a single level. The callback receives each uint16 data value once.
 * @param room the level room for which to execute the loop.
 * @param iterator callback to run for each value; receives the uint16 data code for each decoration once.
 */
export function iterateUpperValues(room: LevelRoom, iterator: (value: number) => void) {
    if (!room) return;
    if (room.stateHistory === undefined) {
        const view = new DataView(room.data);
        for (let i = 0; i < 176; ++i) iterator(view.getUint16(i * 2 + 354, true));
    } else
        room.stateHistory[room.statePointer].upper.forEach(col => {
            col.forEach(iterator)
        });
}
