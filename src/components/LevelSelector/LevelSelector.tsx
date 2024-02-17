/**
 * LevelSelector.tsx: panel for selecting the level being edited.
 */

import React, { useContext } from 'react';
import { Icon } from 'semantic-ui-react';

import { ROOMS, useLevelSelection, useToggleable } from './hooks';
import { LevelSetStateContext } from '../../reducers';

const LevelSelector: React.FC
    = () => {
        
        const [levelSetState, levelSetDispatch] = useContext(LevelSetStateContext);
        const selectLevel = useLevelSelection(levelSetState, levelSetDispatch);

        // whether or not individual levels are collapsed (hiding room selector) or moused over
        const [collapsed, toggleCollapsed] = useToggleable(50);
        const [roomMousedOver, setRoomMousedOver] = React.useState(-1);

        return (
            <>
                <div className="section-header">
                    Level Selection
                </div>
                <div className="list-pane">
                    {collapsed.map((c, i) => (
                        <div className={`list-pane-item ${c ? "" : "expanded"}`} key={`list-pane-item-${i}`}>
                            <Icon
                                name={c ? "plus" : "minus"}
                                onClick={() => {if (roomMousedOver === -1) toggleCollapsed(i)}}
                            />
                            <span
                                onClick={() => {if (roomMousedOver === -1) toggleCollapsed(i, false); selectLevel(i, roomMousedOver > -1 ? roomMousedOver : 0)}}
                            >
                                Level {i + 1}
                            </span>
                            {!c && ROOMS.map((room, r) => (
                                <div
                                    className="list-pane-item indented"
                                    onClick={() => {selectLevel(i, r)}}
                                    onMouseOver={() => setRoomMousedOver(r)}
                                    onMouseOut={() => setRoomMousedOver(-1)}
                                >
                                    {room}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </>
        );

    };
export default LevelSelector;
