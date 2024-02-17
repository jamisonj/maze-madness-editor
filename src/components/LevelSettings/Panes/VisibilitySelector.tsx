/**
 * VisibilitySelector.tsx: controls for adjusting the visibility of walls, decorations, and background.
 */

import { useContext } from "react"
import { VisibilityToggler } from "../Controls"
import { EditorStateContext } from "../../../reducers"
import { EditorActions, LevelLayer } from "../../../reducers/editorSettings";

const VisibilitySelector: React.FC
    = () => {
        const [editorState, editorDispatch] = useContext(EditorStateContext);
        return (
            <>
                <div style={{ fontVariant: "small-caps" }}>
                    Item and Decoration Visibility
                </div>
                <div className="settings-visibility-container">
                    <div className="settings-visibility-row">
                        <div className="settings-visibility-label">Background:</div>
                        <VisibilityToggler
                            mode={editorState.display.background}
                            onModeChanged={mode => editorDispatch({ type: EditorActions.SetDisplayMode, layer: LevelLayer.Background, mode })}
                        />
                    </div>
                    <div className="settings-visibility-row">
                        <div className="settings-visibility-label">Items/Walls:</div>
                        <VisibilityToggler
                            mode={editorState.display.lower}
                            onModeChanged={mode => editorDispatch({ type: EditorActions.SetDisplayMode, layer: LevelLayer.Lower, mode })}
                        />
                    </div>
                    <div className="settings-visibility-row">
                        <div className="settings-visibility-label">Decorations:</div>
                        <VisibilityToggler
                            mode={editorState.display.upper}
                            middleIsHighlight
                            onModeChanged={mode => editorDispatch({ type: EditorActions.SetDisplayMode, layer: LevelLayer.Upper, mode })}
                        />
                    </div>
                </div>
            </>
        )
    };
export default VisibilitySelector;
