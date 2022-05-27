import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import logoImg from '../assets/images/logo.svg';
import { Button } from "../components/Button";
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';

type ParamsType = {
  id: string
};

const questionSent = () => toast.success('Question sent!');
const questionNotSent = () => toast.error("Question not sent. Log in to submit a question!");

export function Room() {
  const params = useParams<ParamsType>();
  const [newQuestion, setNewQuestion] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (event : FormEvent) => {
    event.preventDefault();

    if(newQuestion.trim() === '') { return; }

    if(!user) {
      questionNotSent();
    }

    const question = {
      content: newQuestion,
      autor: { name: user?.name, avatar: user?.avatar },
      isHighlighted: false,
      isAnswered: false,
    }

    await database.ref(`rooms/${params.id}/questions`).push(question);
    questionSent();
    setNewQuestion('');
  }
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode id={ params.id } />
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>

        <form onSubmit={ handleSubmit }>
          <textarea
            placeholder="O que você quer perguntar?"
            value={ newQuestion }
            onChange={ (event) => setNewQuestion(event.target.value) }
          />

          <div className="form-footer">
            <span>
              Para eniviar uma pergunta,
              <button>faça seu login</button>.
            </span>
            <Button type="submit" disabled={ !user } >Enviar pergunta</Button>
          </div>
          <Toaster />
        </form>
      </main>
    </div>
  );
};