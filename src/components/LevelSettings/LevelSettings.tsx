/**
 * LevelSettings.tsx: settings pane for editing and saving rooms and editors.
 */

import { ClearLevel, WallAndBackgroundSelector, VisibilitySelector, SaveAndLoad } from "./Panes";

export const LevelSettings: React.FC
    = () => (
        <>
            <div className="section-header">
                Level and Editor Settings
            </div>
            <div className="settings-panel">
                <WallAndBackgroundSelector />
                <VisibilitySelector />
                <ClearLevel />
            </div>
            <SaveAndLoad />
        </>
    );
export default LevelSettings;
