/**
 * LevelSetStateProvider.tsx: provides the state and reducer of the current 50-level set to editor children via context.
 */

import React from 'react';
import { LevelSetAction, LevelSetState, initialLevelSetState } from './levelSet';
import { Palette } from '../palette/Palette';

type LevelSetStateAndReducer = [
    LevelSetState,
    React.Dispatch<LevelSetAction>
];

export const LevelSetStateContext = React.createContext<LevelSetStateAndReducer>([
    initialLevelSetState(new ArrayBuffer(211800), new Palette(40)),
    () => {}
]);

const LevelSetStateProvider: React.FC<React.PropsWithChildren<{ levelSetStateAndReducer: LevelSetStateAndReducer }>>
    = ({ levelSetStateAndReducer, children }) => (
        <LevelSetStateContext.Provider value={levelSetStateAndReducer}>
            {children}
        </LevelSetStateContext.Provider>
    );
export default LevelSetStateProvider;
