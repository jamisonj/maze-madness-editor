/**
 * Editor.tsx: the main grid for the application. Handles layout and manages level and editor state via reducers.
 * Children access and update state via context.
 * 
 * The editor must be initialized with loaded data for a complete set of 50 levels in an array buffer as well as
 * an initialized palette object for the lower level items.
 */

import { Header } from "semantic-ui-react";

import { useEditorState, useUndoKeyboardShortcuts } from "./hooks";
import { EditorStateProvider, LevelSetStateProvider } from "../../reducers";
import { LevelSelector, RoomSelector } from "../LevelSelector";
import { LevelGrid } from "../LevelGrid";
import { LevelSettings } from "../LevelSettings";
import { LevelEditControls } from "../LevelEditControls";

/**
 * Properties of the editor component.
 * @member data level set data for all 50 levels in .he8 format.
 */
type EditorProps = {
    data: ArrayBuffer;
};

const Editor: React.FC<EditorProps>
    = ({ data }) => {

        const {levelSetStateAndReducer, editorStateAndReducer} = useEditorState(data);
        const [levelSetState, levelSetDispatch] = levelSetStateAndReducer;

        useUndoKeyboardShortcuts(levelSetDispatch);

        return (
            <LevelSetStateProvider levelSetStateAndReducer={levelSetStateAndReducer}>
                <EditorStateProvider editorStateAndReducer={editorStateAndReducer}>
                    <div className="app-container">
                        <div className="column tertiary vertical-scroll">
                            <LevelSelector />
                        </div>
                        <div className="column secondary centered">
                            <div className="row first-column">
                                <div className="level-editor-pane">
                                    <Header className="level-editor-header" as='h1'>
                                        Level {levelSetState.selectedLevel + 1}
                                    </Header>
                                    <RoomSelector />
                                    <LevelGrid key={`${levelSetState.selectedLevel}_${levelSetState.selectedRoom}`} />
                                </div>
                                <div className="column tertiary flex">
                                    <LevelSettings />
                                </div>
                            </div>
                            <div className="row tertiary">
                                <LevelEditControls />
                            </div>
                        </div>
                    </div>
                </EditorStateProvider>
            </LevelSetStateProvider>
        );

    };
export default Editor;
