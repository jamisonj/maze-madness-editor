/**
 * AutoWallGroup.tsx: a single wall group for adding auto walls which adapt to the surrounding walls.
 */

import { useContext } from "react";
import { Icon } from "semantic-ui-react";

import { EditorStateContext, LevelSetStateContext } from "../../../../reducers";
import { AUTO_WALL, DELETE, EditorActions, PIPE_SQUARE } from "../../../../reducers/editorSettings";
import { WallPalette } from "../../../../constants/walls";
import { ItemCanvas } from "../../Controls";
import { useCurrentRoom } from "../../../Editor/hooks";

type AutoWallGroupProps = {
    wallSets: {[key: string]: number[]};
}

const AutoWallGroup: React.FC<AutoWallGroupProps>
    = ({ wallSets }) => {
        const [editorState, editorDispatch] = useContext(EditorStateContext);
        const [levelSetState] = useContext(LevelSetStateContext);
        const roomState = useCurrentRoom(levelSetState);
        return (
            <div style={{ marginRight: "2em" }}>
                <div style={{ fontVariant: "small-caps" }}>
                    Place/Delete
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div
                        className={`wall-item-div ${editorState.currentItem === AUTO_WALL ? 'active-item' : ''}`}
                        onClick={() => editorDispatch({ type: EditorActions.SetCurrentItem, item: AUTO_WALL })}
                    >
                        AUTO
                    </div>
                    <div
                        className={`wall-item-div ${editorState.currentItem === DELETE ? 'active-item' : ''}`}
                        onClick={() => editorDispatch({ type: EditorActions.SetCurrentItem, item: DELETE })}
                    >
                        <Icon name="delete" style={{ fontSize: "1.4em", marginLeft: "0.2em" }} />
                    </div>
                    {roomState.palette === WallPalette.Pipes && (
                        <ItemCanvas
                            value={wallSets["DLRU"][1]}
                            onClick={() => { editorDispatch({ type: EditorActions.SetCurrentItem, item: PIPE_SQUARE })}}
                            foregroundColor="#ff0000"
                            key={wallSets["DLRU"][1]}
                            selected={editorState.currentItem === PIPE_SQUARE}
                            scale={1}
                            label="?"
                        />
                    )}
                </div>
            </div>
        );
    };
export default AutoWallGroup;
