/**
 * VisibilityToggler.tsx: a three-member radio button for toggling visibility modes for walls, decorations, and the background.
 */

import { EntityDisplayMode } from "../../../reducers/editorSettings";
import { Menu } from "semantic-ui-react";

type VisibilityTogglerProps = {
    mode: EntityDisplayMode;
    onModeChanged: (mode: EntityDisplayMode) => void;
    middleIsHighlight?: boolean;
}

const VisibilityToggler: React.FC<VisibilityTogglerProps>
    = ({ onModeChanged, mode, middleIsHighlight }) => {
        const middleMode = middleIsHighlight ? EntityDisplayMode.Highlighted : EntityDisplayMode.SemiTransparent;
        return (
            <Menu secondary className="settings-visibility-menu">
                <Menu.Item
                    className={`settings-visibility-menu-item ${mode === EntityDisplayMode.Shown ? 'selected' : ''}`}
                    onClick={() => onModeChanged(EntityDisplayMode.Shown)}
                >
                    Shown
                </Menu.Item>
                <Menu.Item
                    className={`settings-visibility-menu-item ${mode === middleMode ? 'selected' : ''}`}
                    style={{ width: "10em" }}
                    onClick={() => onModeChanged(middleMode)}
                >
                    {middleIsHighlight ? "Highlighted" : "Semi-Transparent"}
                </Menu.Item>
                <Menu.Item
                    className={`settings-visibility-menu-item ${mode === EntityDisplayMode.Hidden ? 'selected' : ''}`}
                    onClick={() => onModeChanged(EntityDisplayMode.Hidden)}
                >
                    Hidden
                </Menu.Item>
            </Menu>
        );
    };
export default VisibilityToggler;
