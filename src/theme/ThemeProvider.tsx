/**
 * ThemeProvider.tsx: context provider for theming components.
 */

import React from 'react';
import { Cobalt, Theme } from './Theme';

export const ThemeContext = React.createContext<Theme>(Cobalt);

const ThemeProvider: React.FC<React.PropsWithChildren<{ theme: Theme }>>
    = ({ theme, children }) => (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
export default ThemeProvider;
