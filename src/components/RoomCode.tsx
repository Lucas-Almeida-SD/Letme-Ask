import toast, { Toaster } from 'react-hot-toast';
import copyImg from '../assets/images/copy.svg';
import '../styles/roomCode.scss';

const linkCopied = () => toast.success('Link copied!');

type PropsType = {
  id: string
}


export function RoomCode(props : PropsType) {
  const copyCode = () => {
    navigator.clipboard.writeText(props.id);
  linkCopied();

  }

  return (
    <>
      <button className='room-code' onClick={ copyCode }>
        <div>
          <img src={ copyImg } alt="Copy" />
        </div>
        <span>Sala: <strong>{props.id}</strong></span>
      </button>
      <Toaster />
    </>
  );
}