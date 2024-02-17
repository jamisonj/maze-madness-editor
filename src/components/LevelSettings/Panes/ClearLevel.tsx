/**
 * ClearLevel.tsx: buttons for clearing items or decorations from the level.
 */

import { useContext } from "react";
import { Button } from "semantic-ui-react";

import { LevelSetStateContext } from "../../../reducers";
import { LevelActions, LevelClearTarget } from "../../../reducers/level";
import { PaletteContext } from "../../../palette/PaletteProvider";

const ClearLevel: React.FC
    = () => {
        const [, levelSetDispatch] = useContext(LevelSetStateContext);
        const {lower: palette} = useContext(PaletteContext);
        return (
            <>
                <div style={{ fontVariant: "small-caps", marginBottom: "0.5em" }}>
                    Clear Level
                </div>
                <div style={{ marginLeft: "1.2em" }}>
                    <Button secondary
                        className="spaced-button"
                        onClick={() => levelSetDispatch({ type: LevelActions.Clear, target: LevelClearTarget.Items, palette })}
                    >
                        Clear Items
                    </Button>
                    <Button secondary
                        className="spaced-button"
                        onClick={() => levelSetDispatch({ type: LevelActions.Clear, target: LevelClearTarget.Walls, palette })}
                    >
                        Clear Walls
                    </Button>
                    <Button secondary
                        className="spaced-button"
                        onClick={() => levelSetDispatch({ type: LevelActions.Clear, target: LevelClearTarget.Decorations, palette })}
                    >
                        Clear Decorations
                    </Button>
                </div>
            </>
        )
    };
export default ClearLevel;
