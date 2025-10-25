import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <h1 className="header-title">Trivia Questions Dashboard</h1>
      <button className="header-button">About</button>
    </header>
  );
};

export default Header;