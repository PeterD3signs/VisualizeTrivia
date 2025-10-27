import React from 'react';
import './componentStyles/Header.css';
import logo from "../assets/logo.png"

interface Props {
    mobileMode: boolean;
}
const Header: React.FC<Props> = ({mobileMode}) => {
    return (
        <header className="header">
            <div className="header-start">
                {!mobileMode && <div className="color-square"></div>}
                <img src={logo} alt="" className="app-logo" onError={(e) => (e.currentTarget.style.display = "none")}/>
                <h1 className={`header-title ${mobileMode ? "smaller-title" : ""}`}>VisualizeTrivia</h1>
            </div>
        </header>
    );
};

export default Header;