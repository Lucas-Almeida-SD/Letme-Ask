import { FormEvent, useEffect, useState } from 'react';
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

type FirebaseQuestions = Record<string,{
  content:string,
  author: { name: string, avatar: string },
  isHighlighted: boolean,
  isAnswered: boolean,
}>

type Questions = {
  id: string,
  content:string,
  author: { name: string, avatar: string },
  isHighlighted: boolean,
  isAnswered: boolean,
}

const questionSent = () => toast.success('Question sent!');
const questionNotSent = () => toast.error("Question not sent. Log in to submit a question!");

export function Room() {
  const params = useParams<ParamsType>();
  const [newQuestion, setNewQuestion] = useState('');
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Questions[]>([])
  const [title, setTitle] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`/rooms/${params.id}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions : FirebaseQuestions = databaseRoom.questions ?? {};
      
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => ({
        id: key,
        content: value.content,
        author: value.author,
        isHighlighted: value.isHighlighted,
        isAnswered: value.isAnswered,
      }));
      
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions);
    })
    
  }, [params.id]);

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
      </main>
    </div>
  );
};