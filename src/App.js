import React, { useState } from 'react';
import Home from './components/Home';
import LiveScreen from './components/LiveScreen';

import './index.css';

const App = () => {
    const [screen, setScreen] = useState(1);

    const setScreenHandler = screenId => setScreen(screenId);

    return (
        <div className="container">
            <div className="buttons-container">
                <button onClick={setScreenHandler.bind(this, 1)}>Home</button>
                <button onClick={setScreenHandler.bind(this, 2)}>Live Screen</button>
            </div>
            <div style={{ width: '100%' }}>
                {
                    screen === 1 
                        ? <Home />
                        : <LiveScreen />
                }
            </div>
        </div>
    );
}

export default App;
