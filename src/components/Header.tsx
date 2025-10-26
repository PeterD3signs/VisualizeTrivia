import React from 'react';
import './componentStyles/Header.css';

interface Props {
    width: number;
    mobileWidth: number;
}
const Header: React.FC<Props> = ({width, mobileWidth}) => {
    return (
        <header className="header">
            <div className="header-start">
                {width > mobileWidth && <div className="color-square"></div>}
                <img src="/logo.png" className="app-logo" />
                <h1 className="header-title">VisualizeTrivia</h1>
            </div>
        </header>
    );
};

export default Header;