/**
 * WallCanvas.tsx: an individual canvas for selecting a new wall style for a room. Displays a snippet of a wall of the given style.
 * The border is a different color if the canvas is selected.
 */

import { useContext, useMemo } from "react";
import { WallPalette } from "../../../constants/walls";
import { PaletteContext } from "../../../palette/PaletteProvider";
import { ItemCanvas } from "../../LevelEditControls/Controls";

type WallCanvasProps = {
    wallPalette: WallPalette;
    backgroundColor: string;
    selected?: boolean;
    onClick: () => void;
};

const WallCanvas: React.FC<WallCanvasProps>
    = ({ wallPalette, selected, onClick }) => {
        const { lower: palette } = useContext(PaletteContext);
        const wall = useMemo(() => palette.chooseWall(wallPalette, "LR"), [palette, wallPalette]);
        return (
            <ItemCanvas
                value={wall}
                onClick={onClick}
                foregroundColor="#ff0000"
                selected={selected}
                scale={0.8}
            />
        );
    };
export default WallCanvas;
