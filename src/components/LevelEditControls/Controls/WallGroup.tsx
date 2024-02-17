/**
 * WallGroup.tsx: component representing a group of walls for a particular orientation and wall style.
 */

import { useContext } from "react";
import { EditorActions } from "../../../reducers/editorSettings";
import ItemCanvas from "./ItemCanvas";
import { EditorStateContext } from "../../../reducers";

/**
 * Properties of the wall group component.
 * @member indexes uint16 codes corresponding to the walls in this group.
 * @member editorDispatch React reducer dispatcher for updating the current editor state.
 * @member editorState the current state of the editor.
 * @member label the title of this wall group; displayed in small caps above the wall images.
 */
type WallGroupProps = {
    indexes: number[];
    label: string;
};

/**
 * Renders a group of walls with a particular orientation as selectable canvases. The orientation is displayed in small caps above the group
 * of canvases. When a wall is clicked, the editor state is updated such that the wall is selected for placement. The selected wall has a red
 * border.
 * @returns a wall group component.
 */
const WallGroup: React.FC<WallGroupProps>
    = ({ indexes, label }) => {
        const [editorState, editorDispatch] = useContext(EditorStateContext);
        return (
            <div style={{ marginRight: "2em" }}>
                <div style={{ fontVariant: "small-caps" }}>
                    {label}
                </div>
                {indexes.map(item => (
                    <ItemCanvas
                        value={item}
                        onClick={() => { editorDispatch({ type: EditorActions.SetCurrentItem, item })}}
                        foregroundColor="#ff0000"
                        key={item}
                        selected={editorState.currentItem === item}
                        scale={1}
                    />
                ))}
            </div>
        );
    };
export default WallGroup;
