/**
 * History.tsx: pane displayed when undoing and redoing edits to the current room of the current level.
 */

import { Button, Icon, Message } from "semantic-ui-react";

import { LevelSetActions } from "../../../reducers/levelSet";
import { useContext } from "react";
import { LevelSetStateContext } from "../../../reducers";

/* Instruction messages */
const CTRL = navigator.userAgent.indexOf("Mac") !== -1 ? "⌘" : "Ctrl";
const NO_HISTORY_MESSAGE = "After performing some edits to the current level, you will be able to undo/redo here.";
const HISTORY_MESSAGE = `Click below to undo/redo previous actions or reset the level. You can also undo with ${CTRL}+Z and redo with ${CTRL}+Shift+Z.`;

/**
 * History pane for undoing and redoing actions. These apply *only* to the currently selected room of the currently selected level.
 * If edits have been made, the pane will display undo, redo, and reset buttons. If no edits have been made, a message is displayed
 * instructing the user to make edits before using the history pane.
 * @returns React component representing the history pane.
 */
const History: React.FC
    = () => {

        const [levelState, levelDispatch] = useContext(LevelSetStateContext);
        const room = levelState.levels[levelState.selectedLevel][levelState.selectedRoom];
        const historyLength = room.stateHistory!.length;

        return (
            <div className="edit-pane" style={{ textAlign: "center" }}>
                <Message className="info-message">
                    {historyLength === 1 ? NO_HISTORY_MESSAGE : HISTORY_MESSAGE}<br />
                    {historyLength > 1 && `There are ${historyLength - 1} total actions in the history which can be undone/redone.`}
                </Message>
                {historyLength > 1 && (
                    <>
                        <Button
                            className="spaced-button"
                            onClick={() => levelDispatch({ type: LevelSetActions.UndoLast })}
                        >
                            <Icon name="undo" /> Undo Last Action
                        </Button>
                        <Button
                            className="spaced-button"
                            onClick={() => levelDispatch({ type: LevelSetActions.RedoLast })}
                        >
                            <Icon name="redo" /> Redo Last Action
                        </Button>
                        <Button
                            className="spaced-button"
                            onClick={() => levelDispatch({ type: LevelSetActions.ResetLevel })}
                        >
                            <Icon name="refresh" /> Reset Level
                        </Button>
                    </>
                )}
            </div>
        );

    };
export default History;
