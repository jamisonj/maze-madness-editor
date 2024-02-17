/**
 * RoomSelector.tsx: a horizontal menu for selecting a room on the current level.
 */

import { Menu } from "semantic-ui-react";
import { ROOMS, useLevelSelection } from "./hooks";
import { useContext } from "react";
import { LevelSetStateContext } from "../../reducers";

const RoomSelector: React.FC
    = () => {
        const [levelSetState, levelSetDispatch] = useContext(LevelSetStateContext);
        const selectLevel = useLevelSelection(levelSetState, levelSetDispatch);
        return (
            <div className="level-editor-menu">
                <Menu secondary pointing>
                    {ROOMS.map((r, i) => (
                        <Menu.Item
                            key={r}
                            active={levelSetState.selectedRoom === i}
                            className={`level-editor-menu-item ${levelSetState.selectedRoom === i ? 'selected' : ''}`}
                            onClick={() => selectLevel(levelSetState.selectedLevel, i)}
                        >
                            {r}
                        </Menu.Item>
                    ))}
                </Menu>
            </div>
        );
    };
export default RoomSelector;
