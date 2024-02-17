/**
 * LockUnlockGroups.tsx: components for updating the editor state to lock/unlock single or multiple walls on click.
 */

import { useContext } from "react";
import { Button, Icon } from "semantic-ui-react";

import { SQUARE_SIZE } from "../../../LevelGrid/draw";
import { EditorStateContext, LevelSetStateContext } from "../../../../reducers";
import { EditorActions, LOCK_SINGLE_WALL, UNLOCK_SINGLE_WALL } from "../../../../reducers/editorSettings";
import { LevelActions } from "../../../../reducers/level";
import { PaletteContext } from "../../../../palette/PaletteProvider";

const LockUnlockGroups: React.FC
    = () => {
        
        const [editorState, editorDispatch] = useContext(EditorStateContext);
        const [, levelSetDispatch] = useContext(LevelSetStateContext);
        const { lower: palette } = useContext(PaletteContext);

        return (
            <>
                <div style={{ marginRight: "2em", minWidth: `${SQUARE_SIZE * 3}px` }}>
                    <div style={{ fontVariant: "small-caps" }}>
                        Lock/Unlock One
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div
                            className={`wall-item-div ${editorState.currentItem === LOCK_SINGLE_WALL ? 'active-item' : ''}`}
                            onClick={() => editorDispatch({ type: EditorActions.SetCurrentItem, item: LOCK_SINGLE_WALL })}
                        >
                            <Icon name="lock" style={{ fontSize: "1.4em", marginLeft: "0.2em" }} />
                        </div>
                        <div
                            className={`wall-item-div ${editorState.currentItem === UNLOCK_SINGLE_WALL ? 'active-item' : ''}`}
                            onClick={() => editorDispatch({ type: EditorActions.SetCurrentItem, item: UNLOCK_SINGLE_WALL })}
                        >
                            <Icon name="lock open" style={{ fontSize: "1.4em", marginLeft: "0.2em" }} />
                        </div>
                    </div>
                </div>
                <div style={{ marginRight: "2em", minWidth: `${SQUARE_SIZE * 3}px` }}>
                    <div style={{ fontVariant: "small-caps" }}>
                        Lock/Unlock All
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Button
                                className="spaced-button"
                                onClick={() => levelSetDispatch({ type: LevelActions.SetWallsNotSmart })}
                            >
                                Lock All
                            </Button>
                            <Button
                                className="spaced-button"
                                onClick={() => levelSetDispatch({ type: LevelActions.SetWallsSmart, palette })}
                            >
                                Unlock All
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        );

    };
export default LockUnlockGroups;
