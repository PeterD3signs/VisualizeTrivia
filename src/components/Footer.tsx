import React from 'react';
import './componentStyles/Footer.css';
import ghlogo from "../assets/github.png"
import lilogo from "../assets/linkedin.png"

interface Props {
    mobileMode: boolean;
}
const Header: React.FC<Props> = ({mobileMode}) => {
    return (
        <footer className="footer">
            <div className="footer-start">
                {!mobileMode ? <div className="color-square"></div> : <div className="color-square short-color-square"></div>}
                <div className="link-container">
                    <p className="title">Socials</p>
                    <a className="link" href="https://github.com/PeterD3signs/" target="_blank" rel="noopener noreferrer">
                        <img src={ghlogo} alt="" className="app-logo-gh" onError={(e) => (e.currentTarget.style.display = "none")}/>GitHub
                    </a>
                    <a className="link" href="https://www.linkedin.com/in/piotr-kosowicz-4896b9352" target="_blank" rel="noopener noreferrer">
                        <img src={lilogo} alt="" className="app-logo-li" onError={(e) => (e.currentTarget.style.display = "none")}/>LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Header;