/**
 * PaletteProvider.tsx: context provider for upper and lower palettes.
 */

import React from 'react';
import { Palette } from './Palette';
import { SQUARE_SIZE } from '../components/LevelGrid/draw';
import { Backgrounds } from './Backgrounds';

export type Palettes = {
    upper: Palette;
    lower: Palette;
    backgrounds: Backgrounds;
};

export const PaletteContext = React.createContext<Palettes>({
    lower: new Palette(SQUARE_SIZE),
    upper: new Palette(SQUARE_SIZE),
    backgrounds: new Backgrounds()
});

const PaletteProvider: React.FC<React.PropsWithChildren<{ palettes: Palettes }>>
    = ({ palettes, children }) => (
        <PaletteContext.Provider value={palettes}>
            {children}
        </PaletteContext.Provider>
    );
export default PaletteProvider;
