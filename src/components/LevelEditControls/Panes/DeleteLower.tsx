/**
 * DeleteLower.tsx: pane displayed when deleting items or walls.
 */

import React from 'react';
import { Message } from 'semantic-ui-react';

const DeleteLower: React.FC
    = () => (
        <div style={{ margin: "1em" }}>
            <Message className='info-message'>
                Click on a square in the editor to delete the item or wall there.
            </Message>
        </div>
    );
export default DeleteLower;
