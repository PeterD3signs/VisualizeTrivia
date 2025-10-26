import React from 'react';
import './componentStyles/Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-start">
                <div className="color-square"></div>
                <img src="/logo.png" className="app-logo" />
                <h1 className="header-title">VisualizeTrivia</h1>
            </div>
        </header>
    );
};

export default Header;