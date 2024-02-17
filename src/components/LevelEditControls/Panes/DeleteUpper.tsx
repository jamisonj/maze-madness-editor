/**
 * DeleteUpper.tsx: pane displayed when deleting decorations on the upper level of the map.
 */

import { Message } from "semantic-ui-react";

const DeleteUpper: React.FC
    = () => (
        <div style={{ margin: "1em" }}>
            <Message className="info-message">
                Click a decoration to remove it. Decorations occupying more than one square must be deleted from the square in which
                they were placed. Choose "highlight" on the settings panel to highlight decorations by square.
            </Message>
        </div>
    );
export default DeleteUpper;
