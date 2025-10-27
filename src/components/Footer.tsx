import React from 'react';
import './componentStyles/Footer.css';

interface Props {
    width: number;
    mobileWidth: number;
}
const Header: React.FC<Props> = ({width, mobileWidth}) => {
    return (
        <footer className="footer">
            <div className="footer-start">
                {width > mobileWidth ? <div className="color-square"></div> : <div className="color-square short-color-square"></div>}
                <div className="link-container">
                    <p className="title">Socials</p>
                    <a className="link" href="https://github.com/PeterD3signs/" target="_blank" rel="noopener noreferrer">
                        <img src={`${import.meta.env.BASE_URL}github.png`} alt="" className="app-logo-gh" />GitHub
                    </a>
                    <a className="link" href="https://www.linkedin.com/in/piotr-kosowicz-4896b9352" target="_blank" rel="noopener noreferrer">
                        <img src={`${import.meta.env.BASE_URL}linkedin.png`} alt="" className="app-logo-li" />LinkedIn
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Header;