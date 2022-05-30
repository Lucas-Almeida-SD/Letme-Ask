import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { database } from '../services/firebase';

export function Home() {
  const { user, signInWIthGoogle } = useAuth();
  const history = useHistory();
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = async () => {
    if (!user) {
      await signInWIthGoogle();
    }
    history.push('/Letme-Ask/rooms/new')
  };

  const handleSubmit = async (event : FormEvent) => {
    event.preventDefault();

    if (roomCode.trim() === '') { return; }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    const roomSelected = roomRef.val();
    
    if (!roomRef.exists()) { 
      return alert('Room does not exists!')
    }
    
    if (roomSelected.closedAt) {
      return window.alert('Room already closed!')
    }

    if (roomSelected.authorId === user?.id) {
      history.push(`/Letme-Ask/admin/rooms/${roomCode}`);
    } else {
      history.push(`/Letme-Ask/rooms/${roomCode}`);
    }
  };

  return(
    <div id="page-auth">
      <aside>
        <img
          src={ illustrationImg }
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real.</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={ logoImg } alt="Letme Ask" />
          <button
            type="button"
            className="create-room"
            onClick={ handleCreateRoom }
          >
            <img src={ googleIconImg } alt="Logo Google" />
            Crie sua sala com o Google
          </button>
          <h2 className="separator">ou entre em uma sala</h2>
          <form onSubmit={ handleSubmit }>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={ roomCode }
              onChange={ (event) => setRoomCode(event?.target.value) }
            />
            <Button type="submit" >
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};
