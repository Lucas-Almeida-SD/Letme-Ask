import copyImg from '../assets/images/copy.svg';

import '../styles/roomCode.scss';

type PropsType = {
  id: string
}

export function RoomCode(props : PropsType) {
  const copyCode = () => {
    navigator.clipboard.writeText(props.id);
  }

  return (
    <button className='room-code' onClick={ copyCode }>
      <div>
        <img src={ copyImg } alt="Copy" />
      </div>
      <span>Sala: <strong>{props.id}</strong></span>
    </button>
  );
}