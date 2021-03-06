import { FormEvent, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import { Button } from "../components/Button";
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { EmptyQuestions } from '../components/EmptyQuestions';
import { Loading } from '../components/Loading';

import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/images/logo.svg';

import { database } from '../services/firebase';

import { isAdmin } from '../helpers/isAdmin';

import '../styles/room.scss';
import { HomeIcon } from '../components/HomeIcon';

type ParamsType = {
  id: string
};

const questionSent = () => toast.success('Question sent!');
const questionNotSent = () => toast.error("Question not sent. Log in to submit a question!");

export function Room() {
  const params = useParams<ParamsType>();
  const history = useHistory();
  const [newQuestion, setNewQuestion] = useState('');
  const { user, signInWIthGoogle, isFetching} = useAuth();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId);
  const emptyRoomText = 'Faça o seu login e seja a primeira pessoa a fazer uma pergunta!';

  useEffect(() => {
    if (user) {
      isAdmin(roomId, user, history);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ roomId, user]);

  const handleLogin = async () => {
    await signInWIthGoogle();
  };

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

    await database.ref(`rooms/${roomId}/questions`).push(question);
    questionSent();
    setNewQuestion('');
  }

  const handleLike = async (questionId : string, likeId : string | undefined) => {
    if (likeId) {
      database.ref(`/rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
      .remove();
    } else {
      database.ref(`/rooms/${roomId}/questions/${questionId}/likes`)
        .push({ authorId: user?.id });
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode id={ roomId } />
            <HomeIcon />
          </div>
        </div>
      </header>

      {(!isFetching) ? (
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
                  {`Para eniviar uma pergunta, `}
                  <button onClick={ handleLogin }>faça seu login</button>.
                </span>
              )}
              <Button type="submit" disabled={ !user } >Enviar pergunta</Button>
            </div>
            <Toaster />
          </form>

          <div className="question-list">
            {questions.map((question, index) => (
              <Question
                key={question.id}
                content={ question.content }
                author={ question.author }
                isAnswered={ question.isAnswered }
                isHighlighted={question.isHighlighted }
                answers={ question.answers }
              >
                {(!question.isAnswered) && (
                  <button
                  type="button"
                  className={`like-button ${question.likeId ? 'liked' : ''}`}
                  aria-label="Marcar como gostei"
                  onClick={() => handleLike(question.id, question.likeId)}
                  >
                    <span>{ (question.likeCount) > 0 ? question.likeCount : 0}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </Question>))}
              {(!questions.length) && <EmptyQuestions emptyRoomText={ emptyRoomText } />}
          </div>
        </main>) : <Loading />}
    </div>
  );
};