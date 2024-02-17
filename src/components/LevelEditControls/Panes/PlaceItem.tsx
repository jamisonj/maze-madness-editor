/**
 * PlaceItem.tsx: controls for placing items on the map.
 */

import React, { useContext } from 'react';
import { PaletteContext } from '../../../palette/PaletteProvider';
import { EditorActions } from '../../../reducers/editorSettings';
import { ItemCanvas } from '../Controls';
import { EditorStateContext } from '../../../reducers';

/**
 * Groups of items. Each group contains indexes which refer to the item's location within the *core item palette*.
 * These are *not* uint16 codes, and must be converted via the lower palette class instance.
 */
const GROUPS = [
    ["Point-Scoring", [1,3,4,5,6,7,8,9,10,11,12,13,14,20,21,22,23,76,66]],
    ["Gates", [24,25,34,35,36,37,38,39,2,40,41,42,26,27,28,29,30,31,32,33,57,71,72]],
    ["Bonus", [43,44,45,46,47,15,16,17,18,19]],
    ["Currents/Flow", [48,49,50,51,52,53,54,55,56,60,62,63,64,65]],
    ["Mobile Items", [58,67,68,59,69,70,61]],
    ["Enemies", [73,74,75,77,78,79]],
    ["Exits and Start Squares", [80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103]]
] as [string, number[]][];

/**
 * Editor pane for placing items on the level grid. The pane displays items in groups; when an item is clicked, the pane updates the
 * editor state to set the current item selection. The current item selection is read by the grid when the user iteracts with it to
 * determine which item should be placed.
 * @returns the item placement editor pane.
 */
const PlaceItem: React.FC
    = () => {

        const [editorState, editorDispatch] = useContext(EditorStateContext);
        const { lower: palette } = useContext(PaletteContext);
        const itemIndexes = palette.itemSetAtIndex(undefined);

        return (
            <div className="edit-pane" style={{ display: "flex", flexDirection: "row" }}>
                {GROUPS.map(([name, items]) => (
                    <div style={{ width: "14%" }}>
                        <div style={{ fontVariant: "small-caps" }}>
                            {name}
                        </div>
                        {items.map(item => (
                            <ItemCanvas
                                value={itemIndexes[item - 1]}
                                onClick={() => { editorDispatch({ type: EditorActions.SetCurrentItem, item: itemIndexes[item - 1] })}}
                                foregroundColor="#ff0000"
                                key={item}
                                selected={editorState.currentItem === itemIndexes[item - 1]}
                                scale={1}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );

    };
export default PlaceItem;
