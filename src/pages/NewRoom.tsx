import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import '../styles/auth.scss';
import { Button } from '../components/Button';
import { database } from '../services/firebase';

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [newRoom, setNewRoom] = useState('');

  
  const handleSubmit = async (event : FormEvent) => {
    event.preventDefault();
    if (newRoom.trim() === '') { return; }

    const roomRef =  database.ref('rooms');
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
      authorName: user?.name,
      authorImage: user?.avatar,
    });

    history.push(`/Letme-Ask/admin/rooms/${firebaseRoom.key}`)
  }

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
          <h1>{user?.name}</h1>
          <h2>Crie uma nova sala</h2>
          <form onSubmit={ handleSubmit }>
            <input
              type="text"
              placeholder="Nome da sala"
              value={ newRoom }
              onChange={ (event) => setNewRoom(event?.target.value) }
            />
            <Button type="submit" >
              Criar sala
            </Button>
            <p>
              Quer entrar em uma sala existente?
              <Link to="/Letme-Ask">Clique aqui</Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
};
