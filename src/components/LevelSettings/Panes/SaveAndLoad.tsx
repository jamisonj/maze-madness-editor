/**
 * SaveAndLoad.tsx: controls for saving the current levels or loading from a .he8 file.
 */

import { useCallback, useContext, useRef } from "react"
import { Button, Icon } from "semantic-ui-react";

import { LevelSetStateContext } from "../../../reducers";
import { saveArrayBufferToFile, writeLevel, writeLevelSet, writeRoom } from "../../../data/data";
import FileUpload from '../../../data/upload';
import { LevelSetActions } from "../../../reducers/levelSet";
import { PaletteContext } from "../../../palette/PaletteProvider";
import { ROOMS } from "../../LevelSelector/hooks";

const SaveAndLoad: React.FC
    = () => {

        const [levelSetState, levelSetDispatch] = useContext(LevelSetStateContext);
        const {lower: palette} = useContext(PaletteContext);
        
        // for loading
        const fileInput = useRef<HTMLInputElement>(null);
        const onFileChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>, _: any) => {
                if (!e.target.files || !e.target.files[0]) return;
                e.target.files[0].arrayBuffer()
                    .then(buffer => levelSetDispatch({
                        type: LevelSetActions.Open,
                        buffer,
                        palette
                    }));
            }, [levelSetDispatch, palette]
        );

        // for saving
        const writeCurrentRoom = useCallback(() => {
            saveArrayBufferToFile(
                writeRoom(levelSetState.levels[levelSetState.selectedLevel][levelSetState.selectedRoom]),
                `level-${levelSetState.selectedLevel + 1}.${ROOMS[levelSetState.selectedRoom].replace(/ /g, '-')}.he8`
            );
        }, [levelSetState]);
        const writeCurrentLevel = useCallback(() => {
            saveArrayBufferToFile(
                writeLevel(levelSetState.levels[levelSetState.selectedLevel]),
                `level-${levelSetState.selectedLevel}.he8`
            );
        }, [levelSetState]);

        return (
            <>
                <div className="section-header tight">
                    Save/Load
                </div>
                <div style={{ marginLeft: "1.2em", marginTop: "1.2em" }}>
                    <Button secondary
                        className="spaced-button"
                        onClick={writeCurrentRoom}
                    >
                        <Icon name="download" />Save Room
                    </Button>
                    <Button secondary
                        className="spaced-button"
                        onClick={writeCurrentLevel}
                    >
                        <Icon name="download" />Save Level
                    </Button>
                    <Button secondary
                        className="spaced-button"
                        onClick={() => saveArrayBufferToFile(writeLevelSet(levelSetState), "maze.he8")}
                    >
                        <Icon name="download" />Save 50 Level Set
                    </Button>
                </div>
                <div style={{ marginLeft: "1.2em", marginTop: "1.2em" }}>
                    <Button secondary
                        className="spaced-button"
                        onClick={() => fileInput && fileInput.current && fileInput.current.click()}
                    >
                        <Icon name="upload" />Open Level Set from .he8 file
                    </Button>
                    <FileUpload
                        ref={fileInput}
                        onChange={onFileChange}
                    />
                </div>
            </>
        )
    };
export default SaveAndLoad;
