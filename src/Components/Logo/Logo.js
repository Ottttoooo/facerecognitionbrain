import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
    return (
        <div className="ma4 mt0" style={{height: '150px', width: '150px'}}>
            <Tilt >
                <div className="Tilt br2 shadow-2" style={{ height: '150px', width: '150px'}}>
                    <div className="pa3"><img alt="Logo" src={brain} /></div>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;