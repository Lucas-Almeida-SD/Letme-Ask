import { Link } from 'react-router-dom';

import homeImg from '../assets/images/home2.svg';

import '../styles/homeIcon.scss';

export function HomeIcon() {
  return (
    <Link to="/Letme-Ask" id="home-icon">
      <img src={ homeImg } alt="Home" />
    </Link>
  );
}