/**
 * LevelEditControls.tsx: the edit control panel.
 */

import React, { useCallback, useContext } from "react";
import { Icon, SemanticICONS } from "semantic-ui-react";

import { EditorActions, EditorMode } from "../../reducers/editorSettings";

import { DeleteLower, DeleteUpper, History, PlaceDecoration, PlaceItem, PlaceWall, Validate } from "./Panes";
import { EditorStateContext, LevelSetStateContext } from "../../reducers";
import { useCurrentRoom } from "../Editor/hooks";

/**
 * Properties of an edit menu item component; these are used to change the current editor mode.
 * @member onClick callback when the item is clicked; changes the editor mode.
 * @member icon the semantic UI icon to display on the item.
 * @member name the text to display on the item.
 * @member selected true if the current editor mode matches this menu item.
 */
export type LevelEditMenuItemProps = {
    onClick: () => void;
    icon: SemanticICONS;
    name: string;
    selected: boolean;
};

/**
 * Editor menu item component; these represent different editor modes, and change the current mode when clicked.
 * @returns an edit menu item component.
 */
const LevelEditMenuItem: React.FC<LevelEditMenuItemProps>
    = ({ onClick, selected, icon, name }) => (
        <div
            className={`edit-menu-item ${selected ? 'active-item' : ''}`}
            onClick={onClick}
        >
            <Icon name={icon} style={{ fontSize: "1.3em" }} /><br />{name}
        </div>
    );

/**
 * Level edit controls. This component renders a menu for switching the editor mode, along with an edit pane. The edit pane contains various
 * controls for editing the current level based on the selected edit mode.
 * @returns a level edit control component.
 */
const LevelEditControls: React.FC
    = () => {
        
        const [levelSetState] = useContext(LevelSetStateContext);
        const [editorState, editorDispatch] = useContext(EditorStateContext);
        const roomState = useCurrentRoom(levelSetState);
        const onModeChanged = useCallback((mode: EditorMode) => {
            editorDispatch({ type: EditorActions.SetEditMode, mode });
        }, [editorDispatch]);

        return (
            <>
                <div className="section-header editor-section">
                    Edit
                </div>
                <div className="edit-pane-menu">
                    <LevelEditMenuItem
                        onClick={() => onModeChanged(EditorMode.Validate)}
                        icon="check"
                        name="Error Check"
                        selected={editorState.mode === EditorMode.Validate}
                    />
                    <LevelEditMenuItem
                        onClick={() => onModeChanged(EditorMode.History)}
                        icon="history"
                        name="Undo/Redo"
                        selected={editorState.mode === EditorMode.History}
                    />
                    <LevelEditMenuItem
                        onClick={() => onModeChanged(EditorMode.DeletingLower)}
                        icon="delete"
                        name="Delete Item"
                        selected={editorState.mode === EditorMode.DeletingLower}
                    />
                    <LevelEditMenuItem
                        onClick={() => onModeChanged(EditorMode.SettingLower)}
                        icon="paint brush"
                        name="Place Item"
                        selected={editorState.mode === EditorMode.SettingLower}
                    />
                    <LevelEditMenuItem
                        onClick={() => onModeChanged(EditorMode.SettingWall)}
                        icon="pallet"
                        name="Place Wall"
                        selected={editorState.mode === EditorMode.SettingWall}
                    />
                    <LevelEditMenuItem
                        onClick={() => onModeChanged(EditorMode.DeletingUpper)}
                        icon="eraser"
                        name="Delete Decoration"
                        selected={editorState.mode === EditorMode.DeletingUpper}
                    />
                    <LevelEditMenuItem
                        onClick={() => onModeChanged(EditorMode.SettingUpper)}
                        icon="image"
                        name="Place Decoration"
                        selected={editorState.mode === EditorMode.SettingUpper}
                    />
                </div>
                <div className="edit-pane-container">
                    {editorState.mode === EditorMode.SettingLower ? (
                        <PlaceItem key={roomState.palette} />
                    ) : editorState.mode === EditorMode.DeletingLower ? (
                        <DeleteLower />
                    ) : editorState.mode === EditorMode.SettingWall ? (
                        <PlaceWall key={roomState.palette} />
                    ) : editorState.mode === EditorMode.DeletingUpper ? (
                        <DeleteUpper />
                    ) : editorState.mode === EditorMode.SettingUpper ? (
                        <PlaceDecoration key={roomState.palette} />
                    ) : editorState.mode === EditorMode.History ? (
                        <History />
                    ) : editorState.mode === EditorMode.Validate ? (
                        <Validate />
                    ) : null}
                </div>
            </>
        );
    };
export default LevelEditControls;
