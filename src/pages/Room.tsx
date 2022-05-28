import { FormEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import logoImg from '../assets/images/logo.svg';
import { Button } from "../components/Button";
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type ParamsType = {
  id: string
};

const questionSent = () => toast.success('Question sent!');
const questionNotSent = () => toast.error("Question not sent. Log in to submit a question!");

export function Room() {
  const params = useParams<ParamsType>();
  const [newQuestion, setNewQuestion] = useState('');
  const { user } = useAuth();
  const { title, questions } = useRoom(params.id);


  const handleSubmit = async (event : FormEvent) => {
    event.preventDefault();

    if(newQuestion.trim() === '') { return; }

    if(!user) {
      questionNotSent();
    }

    const question = {
      content: newQuestion,
      author: { name: user?.name, avatar: user?.avatar },
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
          <h1>{title}</h1>
          <span>{questions.length} perguntas</span>
        </div>

        <form onSubmit={ handleSubmit }>
          <textarea
            placeholder="O que você quer perguntar?"
            value={ newQuestion }
            onChange={ (event) => setNewQuestion(event.target.value) }
          />

          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={ user.avatar } alt={ user.name } />
                <span>{user.name}</span>
              </div>

            ) : (
              <span>
                Para eniviar uma pergunta,
                <button>faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={ !user } >Enviar pergunta</Button>
          </div>
          <Toaster />
        </form>

        <div className="question-list">
          {questions.map((question, index) => (
            <Question
              key={`user-${index}-${question.author.name}`}
              content={ question.content }
              author={ question.author }
            />))}
        </div>
      </main>
    </div>
  );
};