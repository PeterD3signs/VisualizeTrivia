import React from 'react';
import './componentStyles/Header.css';

//TODO: modify at the end of everything

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="header-title">Trivia Questions Dashboard</h1>
      <button className="header-button">About</button>
    </header>
  );
};

export default Header;