/**
 * validator.ts: checks a level for errors.
 */

import { Palette } from "../palette/Palette";
import { LevelRoom, SingleLevelState } from "../reducers/levelSet";
import { iterateLowerValues } from "./data";

const ROOM_ORDER = [ "Room 1", "Room 2", "Room 3", "Room 4", "Room 5", "the Bonus Room" ];
const reverse = (x: string) => x.split("").reverse().join("");
const parseEdge = (x: string) => [+x.split("-")[0], +x.split("-")[1]] as [number, number];

/**
 * Errors in level design which may cause levels not to be playable.
 * @member TooManyItems more than 40 items are present in a level room; some may not display.
 * @member NoKelpSeeds a level contains 0 kelp seeds; the game will likely crash when it is loaded.
 * @member InvalidStartSquares start squares are not present in room 1 or the bonus room, or are elsewhere.
 * @member InaccessibleRooms one or more non-empty rooms cannot be reached starting from room 1.
 * @member UnpairedCaves one or more caves between rooms has no matching reverse connection.
 * @member MultiplePairedCaves a room has more than one connection to another room.
 * @member SelfReferentialCaves a room has an invalid cave connection to itself.
 * @member MismatchedPalettes more than one wall style and decoration style are mixed.
 */
enum LevelError {
    TooManyItems = "TooManyItems",
    NoKelpSeeds = "NoKelpSeeds",
    InvalidStartSquares = "InvalidStartSquares",
    InaccessibleRooms = "InaccessibleRooms",
    UnpairedCaves = "UnpairedCaves",
    MultiplePairedCaves = "MultiplePairedCaves",
    SelfReferentialCaves = "SelfReferentialCaves",
    MismatchedPalettes = "MismatchedPalettes"
};

/**
 * Represents an error in level design which may cause a level not to be playable.
 * @member code a code indicating the type of error present.
 * @member message descriptive message with error details.
 */
type InvalidLevelError = {
    code: LevelError;
    message: string;
};

/**
 * Checks if a room has too many items. If more than 40 items are present, some may not display when played.
 * @param room the room to check.
 * @param palette class instance containing item codes.
 * @returns true if more than 40 items are present; false otherwise.
 */
function tooManyItems(room: LevelRoom, palette: Palette) {
    let itemCount = 0;
    iterateLowerValues(room, item => { if (item > 0 && !palette.isWall(item)) ++itemCount; });
    return itemCount;
}

/**
 * Checks if a level has no kelp seeds across its six rooms. If this is the case, the game may crash when the level is loaded.
 * @param rooms the rooms to check.
 * @returns true if no kelp seeds are present; false otherwise.
 */
function noKelpSeeds(rooms: SingleLevelState) {
    let kelpSeedCount = 0;
    rooms.forEach(room => {
        iterateLowerValues(room, value => { if (value === 1) ++kelpSeedCount; });
    });
    return kelpSeedCount === 0;
}

/**
 * Checks if a room has no items or walls.
 * @param room the room to check.
 * @returns true if the room is empty; false otherwise.
 */
function roomIsEmpty(room: LevelRoom): boolean {
    let empty: boolean = true;
    iterateLowerValues(room, value => { if (value !== 0) empty = false; });
    return empty;
}

/**
 * Checks if a level has valid start squares. Room 1 must have exactly one; the bonus room must have one if non-empty. Other rooms must have zero.
 * @param rooms the rooms to check; room 1 occupies the first index and the bonus room the last index.
 * @returns true if start squares are invalid; false otherwise.
 */
function validStartSquares(rooms: SingleLevelState): boolean {
    const startSquareCounts = [0, 0, 0, 0, 0, 0];
    rooms.forEach((room, index) => {
        iterateLowerValues(room, value => { if (value >= 175 && value < 179) ++startSquareCounts[index]; })
    });
    const bonusEmpty = roomIsEmpty(rooms[5]);
    if (!bonusEmpty && startSquareCounts[5] !== 1) return false;
    if (startSquareCounts[0] !== 1) return false;
    for (let count of startSquareCounts.slice(1, 5))
        if (count > 0) return false;
    return true;
}

/**
 * Checks if the palettes used for walls and decorations match for a given room. Each room must use only one palette; otherwise, colors may render
 * incorrectly in the game.
 * @param room the level room to check.
 * @param lower palette of lower items and walls.
 * @param upper palette of decorations.
 * @returns true if palettes are mismatched; false otherwise.
 */
function mixedPalettes(room: LevelRoom, lower: Palette, upper: Palette): boolean {
    if (roomIsEmpty(room)) return false;
    const upperPalettes = upper.palettesFromValues(room);
    const lowerPalettes = lower.palettesFromValues(room, true);
    if (lowerPalettes.size !== 1 || upperPalettes.size > 1)
        return true;
    else if (lowerPalettes.size === 1 && upperPalettes.size === 0)
        return false;
    if ([...lowerPalettes][0] !== [...upperPalettes][0]) return true;
    return false;
}

/**
 * Checks cave connections; confirms that all non-empty rooms can be accessed from room 1, and that all caves are properly paired. 
 * @param rooms the rooms to check.
 * @returns A four-member array, representing in order: non-empty rooms which cannot be reached, connections with no matching reverse
 * connection, connections which are duplicated (e.g. two caves from 1 to 2), and self-referential connections (e.g. 1 to 1). For the
 * first and last entries, lists of indexes from 0 to 4 is returned; for the second and third, two-member arrays of indexes representing
 * the invalid connection are returned (e.g. [0,1], [2,4]).
 */
function inaccessibleRoomsAndUnpairedCaves(rooms: SingleLevelState): [number[], [number, number][], [number, number][], number[]] {

    // initialize variables. edgeMap counts how many connections exist in a particular direction between rooms (e.g. 1-2, 3-4)
    const empty = rooms.map(roomIsEmpty);
    const traversed = [false, false, false, false, false];
    const edgeMap = new Map<string, number>();

    // During traversal, we check to see which other rooms a room connects to; we then recursively traverse those rooms.
    // If a room has already been traversed, the function returns immediately.
    const traverseLevel = (room: number) => {
        if (traversed[room]) return;
        traversed[room] = true;
        iterateLowerValues(rooms[room], value => { // loop through all squares
            if (value >= 151 && value < 170) { // this is a "cave to X" square
                const targetRoom = (value - 1) % 5;
                traverseLevel(targetRoom);
                const edgeKey = `${room}-${targetRoom}`; // representation of this connection (e.g. 1-2, 3-4)
                edgeMap.set(edgeKey, (edgeMap.get(edgeKey) || 0) + 1); // count how many connections exist in this direction
            }
        });
    };
    traverseLevel(0); // start traversing at room 1, where the start square is

    // in order: not reachable, no matching reverse connection, too many connections in same direction, self-referential connections
    return [
        [ 0, 1, 2, 3, 4 ].filter(i => !empty[i] && !traversed[i]).sort(), // non-empty, not reachable
        [...edgeMap.keys()].filter(edge => !edgeMap.has(reverse(edge))).map(parseEdge), // no reverse connection
        [...edgeMap.keys()].filter(edge => edgeMap.get(edge)! > 1).map(parseEdge), // too many in one direction
        [ 0, 1, 2, 3, 4 ].filter(i => edgeMap.has(`${i}-${i}`)).sort() // self-referential
    ];

}

/**
 * Checks a level for design errors which may cause it not to be playable.
 * @param level the level to check.
 * @param palette class instance containing codes representing items and walls.
 * @returns a list of errors, each with a descriptive message.
 */
export function validateLevel(level: SingleLevelState, palette: Palette, upperPalette: Palette): InvalidLevelError[] {

    const errors: InvalidLevelError[] = [];
    
    // items, kelp seeds, and start squares
    level.forEach((room, i) => {
        const count = tooManyItems(room, palette);
        if (count > 40)
            errors.push({
                code: LevelError.TooManyItems,
                message: `${ROOM_ORDER[i]} has ${count} items. If more than 40 items are visible at once, some may not display during gameplay.`
            });
        if (mixedPalettes(room, palette, upperPalette))
            errors.push({
                code: LevelError.MismatchedPalettes,
                message: `${ROOM_ORDER[i]} has mismatched walls and decorations. Colors may not load correctly in the game when this room is played.`
            });
    });
    if (noKelpSeeds(level))
        errors.push({
            code: LevelError.NoKelpSeeds,
            message: `This level does not have any kelp seeds. The game may crash when it is loaded.`
        });
    if (!validStartSquares(level))
        errors.push({
            code: LevelError.InvalidStartSquares,
            message: `This level does not have valid start squares. Room 1 must have exactly one start square. Rooms 2-5 must not have any. The bonus room must have one if non-empty.`
        });

    // cave to cave connections
    const [inaccessible, unpaired, multiPaired, selfReferential] = inaccessibleRoomsAndUnpairedCaves(level);
    if (inaccessible.length > 0)
        errors.push({
            code: LevelError.InaccessibleRooms,
            message: `The following rooms are not empty but cannot be accessed: ${inaccessible.map(i => ROOM_ORDER[i]).join(', ')}. Be sure to add caves between rooms.`
        });
    if (unpaired.length > 0)
        errors.push({
            code: LevelError.UnpairedCaves,
            message: `The following caves between rooms are not properly paired: ${unpaired.map(([a, b]) => `${ROOM_ORDER[a]}/${ROOM_ORDER[b]}`).join(', ')}. Be sure each room has a cave to the other.`
        });
    if (selfReferential.length > 0)
        errors.push({
            code: LevelError.SelfReferentialCaves,
            message: `The following rooms have invalid caves to themselves: ${selfReferential.map(i => ROOM_ORDER[i]).join(', ')}. These may cause the game to crash if traversed.`
        });
    if (multiPaired.length > 0)
        errors.push({
            code: LevelError.MultiplePairedCaves,
            message: `The following rooms have more than one cave connection: ${multiPaired.map(([a, b]) => `${ROOM_ORDER[a]}/${ROOM_ORDER[b]}`).join(', ')}. This may cause unexpected behavior.`
        });

    return errors;

}
