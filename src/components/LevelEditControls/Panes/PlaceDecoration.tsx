/**
 * PlaceDecoration.tsx: pane displayed when placing decorations on the map.
 */

import React, { useContext, useMemo } from 'react';
import { Message } from 'semantic-ui-react';

import { PaletteContext } from '../../../palette/PaletteProvider';
import { EditorActions } from '../../../reducers/editorSettings';
import { WallPalette } from '../../../constants/walls';
import { DecorationCanvas } from '../Controls';
import { EditorStateContext, LevelSetStateContext } from '../../../reducers';
import { useCurrentRoom } from '../../Editor/hooks';

/**
 * Editor pane for placing decorations on the level grid. The pane displays decorations for the selected wall style; when an item is clicked,
 * the pane updates the editor state to set the current selection. The current selection is read by the grid when the user iteracts with it to
 * determine which decoration should be placed.
 * @returns the decoration placement editor pane.
 */
const PlaceDecoration: React.FC
    = () => {

        // get level and editor state
        const [levelSetState] = useContext(LevelSetStateContext);
        const [editorState, editorDispatch] = useContext(EditorStateContext);
        const roomState = useCurrentRoom(levelSetState);

        // get palette and decoration images
        const { upper: palette } = useContext(PaletteContext);
        const decorations = useMemo(() => new Set([
            ...palette.decorationsForPalette(roomState.palette),
            ...palette.decorationsForPalette(-1 as WallPalette)
        ]), [palette, roomState]);

        return (
            <div className="edit-pane">
                <Message className="info-message" style={{ textAlign: "center" }}>
                    Select a decoration then click the grid to place it. For decorations occupying multiple squares, the bold-outlined square correspondes
                    to the clicked square.
                </Message>
                {[...decorations].map(item => (
                    <DecorationCanvas
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
export default PlaceDecoration;
