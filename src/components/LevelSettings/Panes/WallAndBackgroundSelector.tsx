/**
 * WallAndBackgroundSelector.tsx: presents interactive squares for selecting the wall style and background for the current room.
 */

import { useContext } from "react";
import { BackgroundCanvas, WallCanvas } from "../Controls";
import { LevelSetStateContext } from "../../../reducers";
import { SQUARE_SIZE } from "../../LevelGrid/draw";
import { useCurrentRoom } from "../../Editor/hooks";
import { ThemeContext } from "../../../theme/ThemeProvider";
import { LevelActions } from "../../../reducers/level";
import { PaletteContext } from "../../../palette/PaletteProvider";

const WallAndBackgroundSelector: React.FC
    = () => {
        const [levelSetState, levelSetDispatch] = useContext(LevelSetStateContext);
        const levelState = useCurrentRoom(levelSetState);
        const theme = useContext(ThemeContext);
        const {lower: palette} = useContext(PaletteContext);
        return (
            <>
                <div style={{ fontVariant: "small-caps" }}>
                    Wall Style
                </div>
                <div className="settings-canvas-selector" style={{ height: SQUARE_SIZE * 2 }}>
                    {[...Array(11)].map((_, index) => (
                        <span style={{ margin: "0.2em" }} key={`wall-canvas-${index}`}>
                            <WallCanvas
                                selected={index + 1 === levelState.palette}
                                backgroundColor={theme.secondary}
                                wallPalette={index + 1}
                                key={`wall-${index}`}
                                onClick={() => levelSetDispatch({ type: LevelActions.SetPalette, wallPalette: index + 1, palette })}
                            />
                        </span>
                    ))}
                </div>
                <div style={{ fontVariant: "small-caps" }}>
                    Background
                </div>
                <div className="settings-canvas-selector" style={{ height: SQUARE_SIZE * 2 }}>
                    {[0, 1, 2, 3, 4, 5, 6, 8, 9].map(index => (
                        <span style={{ margin: "0.2em" }} key={`background-canvas-${index}`}>
                            <BackgroundCanvas
                                foregroundColor={index === levelState.background ? "#ff0000" : theme.foregroundAlt}
                                key={`background-${index}`}
                                onClick={() => { levelSetDispatch({ type: LevelActions.SetBackground, background: index }) }}
                                index={index}
                            />
                        </span>
                    ))}
                </div>
            </>
        );
    };
export default WallAndBackgroundSelector;
