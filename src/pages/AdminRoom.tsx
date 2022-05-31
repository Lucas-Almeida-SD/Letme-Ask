import { useParams, useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "../components/Button";
import { RoomCode } from '../components/RoomCode';
import { database } from '../services/firebase';
import '../styles/room.scss';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import { EmptyQuestions } from '../components/EmptyQuestions';
import { useAuth } from '../hooks/useAuth';
import { Loading } from '../components/Loading';
import { useEffect } from 'react';
import { isAdmin } from '../helpers/isAdmin';
import { HomeIcon } from '../components/HomeIcon';

type ParamsType = {
  id: string
};

const questionRemoved = () => toast.success('Question removed!');

export function AdminRoom() {
  const params = useParams<ParamsType>();
  const roomId = params.id;
  const history = useHistory();
  const { title, questions } = useRoom(roomId);
  const { user, isFetching } = useAuth();
  const emptyRoomText = 'Envie o código desta sala para seus amigos e comece a responder perguntas!';

  useEffect(() => {
    isAdmin(roomId, user, history);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, roomId]);

  const handleCloseRoom = async () => {
    await database.ref(`/rooms/${roomId}`).update({ closedAt: new Date() });
    history.push('/Letme-Ask');
  }

  const handleRemoveQuestion = async (questionId : string) => {
    if (window.confirm('Tem certeza que deseja remover essa pergunta?')) {
      await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove();
      questionRemoved();
    }
  }

  const handleCheckQuestionAsAnswered = async (questionId : string) => {
    await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({ isAnswered: true });
  }

  const handleHighlightQuestion = async (questionId : string) => {
    await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({ isHighlighted: true });
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div className='buttons-header'>
            <RoomCode id={ roomId } />
            <Button isOutlined onClick={ handleCloseRoom }>Encerrar sala</Button>
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

          <div className="question-list">
            {questions.map((question, index) => (
              <Question
                key={`user-${index}-${question.author.name}`}
                content={ question.content }
                author={ question.author }
                isAnswered={ question.isAnswered }
                isHighlighted={question.isHighlighted }
              >
                {(!question.isAnswered) && (
                  <>
                    <button
                      type="button"
                      aria-label="Botão de marcar pergunta como respondida"
                      onClick={ () => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={ checkImg } alt="Marcar perguta" />
                    </button>
                    {(!question.isHighlighted && (
                      <button
                        type="button"
                        aria-label="Botão de dar detaque à pergunta"
                        onClick={ () => handleHighlightQuestion(question.id)}
                      >
                        <img src={ answerImg } alt="Dar detaque à perguta" />
                      </button>
                    ))}
                  </>
                )}
                <button
                  type="button"
                  aria-label="Botão de remover perguta"
                  onClick={ () => handleRemoveQuestion(question.id)}
                >
                  <img src={ deleteImg } alt="Remover perguta" />
                </button>
              </Question>))}
              {(!questions.length) && <EmptyQuestions emptyRoomText={ emptyRoomText } />}
              <Toaster />
          </div>
        </main>) : <Loading />}
    </div>
  );
};