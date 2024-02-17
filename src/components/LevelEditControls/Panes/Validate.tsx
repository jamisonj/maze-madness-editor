/**
 * Validate.tsx: control for checking the current level for errors.
 */

import { useContext, useMemo } from "react";
import { Icon, Message } from "semantic-ui-react";

import { validateLevel } from "../../../data/validator";
import { PaletteContext } from "../../../palette/PaletteProvider";
import { LevelSetStateContext } from "../../../reducers";

const Validate: React.FC
    = () => {
        
        const [levelSetState] = useContext(LevelSetStateContext);
        const { lower, upper } = useContext(PaletteContext);
        const errors = useMemo(() => (
            validateLevel(levelSetState.levels[levelSetState.selectedLevel], lower, upper)
        ), [levelSetState, lower, upper]);

        return (
            <div style={{ margin: "1em", textAlign: "left" }}>
                {errors.length === 0 ? (
                    <Message className="info-message">
                        <Icon name="check" />No errors were detected. This level will likely load and play correctly.
                    </Message>
                ) : (
                    <>
                        {errors.map(error => (
                            <Message className="info-message">
                                <Icon name="warning" />{error.message}
                            </Message>
                        ))}
                    </>
                )}
            </div>
        );

    };
export default Validate;
