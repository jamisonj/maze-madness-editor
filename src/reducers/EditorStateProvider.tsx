/**
 * EditorStateProvider.tsx: provides editor state and reducer to editor children via context.
 */

import React from 'react';
import { EditorAction, EditorState, initialEditorState } from './editorSettings';

type EditorStateAndReducer = [
    EditorState,
    React.Dispatch<EditorAction>
];

export const EditorStateContext = React.createContext<EditorStateAndReducer>([
    initialEditorState(),
    () => {}
]);

const EditorStateProvider: React.FC<React.PropsWithChildren<{ editorStateAndReducer: EditorStateAndReducer }>>
    = ({ editorStateAndReducer, children }) => (
        <EditorStateContext.Provider value={editorStateAndReducer}>
            {children}
        </EditorStateContext.Provider>
    );
export default EditorStateProvider;
