import '../styles/loading.scss';
import loadingImg from '../assets/images/loading.gif';

export function Loading() {
  return (
    <div className="loading">
      <img src={ loadingImg } alt="Carregando" />
    </div>
  );
}