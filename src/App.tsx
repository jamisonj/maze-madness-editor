import React, { useEffect, useMemo, useState } from 'react';
import { Icon, Modal, Progress } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css'
import './App.css';

import { SQUARE_SIZE } from './components/LevelGrid/draw';
import { PALETTE_URLS, UPPER_PALETTE_URLS } from './constants/palette';
import { useMazeData } from './data/hooks';
import ThemeProvider from './theme/ThemeProvider';
import { Cobalt } from './theme/Theme';
import PaletteProvider from './palette/PaletteProvider';
import { useBackgrounds, usePalette } from './palette/hooks';
import Editor from './components/Editor/Editor';

const HOMEPAGE = "https://github.com/hatteringill/maze-madness-editor";
const BTC_ADDRESS = "bc1qa3lup95ueeuvzh8mctjv23vvuzrnfjchy8994r";
const ETH_ADDRESS = "0xB18BF05EfD7aB6835a5c6C2c5d08ac1eb8B170a9";

const App: React.FC<{}>
    = () => {

        // apply theme
        useEffect(() => {
            document.documentElement.setAttribute('data-theme', 'cobalt');
        }, []);
        const theme = Cobalt;

        // load item and decoration palettes and background images
        const { palette, loading, progress } = usePalette(PALETTE_URLS, SQUARE_SIZE);
        const { palette: upperPalette, loading: upperLoading, progress: upperProgress } = usePalette(UPPER_PALETTE_URLS, SQUARE_SIZE);
        const { backgrounds, progress: backgroundsLoading } = useBackgrounds();
	const totalItems = PALETTE_URLS.length + UPPER_PALETTE_URLS.length + 10;
        const palettes = useMemo(() => palette && upperPalette && backgrounds && ({
            upper: upperPalette,
            lower: palette,
            backgrounds
        }), [palette, upperPalette, backgrounds]);

        // load maze level data
        const { data: defaultData } = useMazeData();

        const [modalOpen, setModalOpen] = useState(false);

        return loading || upperLoading || backgroundsLoading !== 9 || !defaultData ? (
            <div style={{ width: "80%", textAlign: "center", marginLeft: "10%" }}>
                <div style={{ height: "10em" }} />
                <Progress
                    percent={100 * (progress + upperProgress + backgroundsLoading) / totalItems}
                />
                Images and data are loading. This may take a moment...
            </div>
        ) : (
            <ThemeProvider theme={theme}>
                <PaletteProvider palettes={palettes}>
                    <Editor data={defaultData} />
                    <div className="bottom-links">
                        <div className='bottom-links-item' onClick={() => setModalOpen(true)}>
                            <Icon name="bitcoin" />
                        </div>
                        <div className='bottom-links-item' onClick={() => {window.open(HOMEPAGE, "_blank")}}>
                            <Icon name="github" />
                        </div>
                    </div>
                    <Modal open={modalOpen} className="display-modal" onClose={() => setModalOpen(false)}>
                        <Modal.Header className="display-modal tertiary">Support</Modal.Header>
                        <Modal.Content className="display-modal">
                            <div style={{ paddingLeft: "1.5em", fontSize: "1.4em" }}>
                                <div style={{ marginBottom: "0.4em" }}>
                                    <Icon name="bitcoin" /> {BTC_ADDRESS}
                                </div>
                                <div style={{ marginBottom: "0.4em" }}>
                                    <Icon name="ethereum" /> {ETH_ADDRESS}
                                </div>
                            </div>
                        </Modal.Content>
                    </Modal>
                </PaletteProvider>
            </ThemeProvider>
        );
    };

export default App;
