import React from 'react';
import './componentStyles/Header.css';

//TODO: modify at the end of everything

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-start">
                <div className="color-square"></div>
                <h1 className="header-title">VisualizeTrivia</h1>
            </div>
        </header>
    );
};

export default Header;