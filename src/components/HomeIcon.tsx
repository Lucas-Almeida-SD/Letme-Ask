import { Link } from 'react-router-dom';

import homeImg from '../assets/images/home2.svg';

import '../styles/homeIcon.scss';

export function HomeIcon() {
  return (
    <Link to="/Letme-Ask">
      <img src={ homeImg } alt="Home" />
    </Link>
  );
}