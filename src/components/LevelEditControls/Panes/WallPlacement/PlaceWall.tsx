/**
 * PlaceWall.tsx: control for placing walls within squares.
 */

import { useContext, useMemo } from "react";
import { Button, Icon, Popup } from "semantic-ui-react";

import { WallGroup } from "../../Controls";
import { ThemeContext } from "../../../../theme/ThemeProvider";
import { PaletteContext } from "../../../../palette/PaletteProvider";
import { LevelSetStateContext } from "../../../../reducers";
import AutoWallGroup from "./AutoWallGroup";
import LockUnlockGroups from "./LockUnlockGroups";
import { useCurrentRoom } from "../../../Editor/hooks";
import { LevelActions } from "../../../../reducers/level";

const KEY_ORDER = ["", "L", "R", "U", "D", "LR", "DU", "LU", "RU", "DR", "DL", "LRU", "DRU", "DLR", "DLU", "DLRU" ];
const LABEL_ORDER = ["None", "Left", "Right", "Up", "Down", "Left/Right", "Up/Down", "Up/Left", "Up/Right", "Down/Right", "Down/Left", "Left/Right/Up", "Down/Right/Up", "Left/Right/Down", "Left/Down/Up", "All"];

const AUTO_WALL_HELP = `
Auto (unlocked) walls change their orientation when walls are placed or removed adjacent to them. Locked walls do not change unless explicitly replaced.
Locked walls have a purple triangle in the upper right corner.
`;

const PlaceWall: React.FC
    = () => {

        const [levelSetState, levelSetReducer] = useContext(LevelSetStateContext);
        const roomState = useCurrentRoom(levelSetState);

        const theme = useContext(ThemeContext);
        const { lower: palette } = useContext(PaletteContext);
        const wallSets = useMemo(() => palette.wallOrientationMap(roomState.palette), [palette, roomState.palette]);
        
        return wallSets === undefined ? null : (
            <div className="edit-pane">
                <div style={{ color: theme.foregroundAlt, fontVariant: "small-caps" }}>
                    Auto Walls&nbsp;
                    <Popup content={AUTO_WALL_HELP} trigger={<Icon name="info circle" />} />
                </div>
                <div style={{ color: theme.foreground, marginBottom: "1.5em", marginTop: "0.4em", display: "flex", flexDirection: "row" }}>
                    <AutoWallGroup wallSets={wallSets} />
                    <LockUnlockGroups />
                    <div style={{ fontVariant: "small-caps" }}>
                        Border
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <Button
                                className="spaced-button"
                                onClick={() => levelSetReducer({ type: LevelActions.CompleteWallBorder, palette })}
                            >
                                Complete Border
                            </Button>
                        </div>
                    </div>
                </div>
                <div style={{ color: theme.foregroundAlt, fontVariant: "small-caps" }}>
                    Locked Walls
                </div>
                <div style={{ color:theme.foreground, overflowX: "auto", maxHeight: "300px", display: "flex", flexDirection: "row" }}>
                    {KEY_ORDER.slice(0, 11).map((orientation, i) => (
                        <WallGroup
                            label={LABEL_ORDER[i]}
                            indexes={wallSets[orientation]}
                        />
                    ))}
                </div>
                <div style={{ color:theme.foreground, overflowX: "auto", maxHeight: "300px", display: "flex", flexDirection: "row" }}>
                    {KEY_ORDER.slice(11).map((orientation, i) => (
                        <WallGroup
                            label={LABEL_ORDER[i + 11]}
                            indexes={wallSets[orientation]}
                        />
                    ))}
                </div>
            </div>
        );

    };
export default PlaceWall;
