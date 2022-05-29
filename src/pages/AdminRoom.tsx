import { useParams, useHistory } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import logoImg from '../assets/images/logo.svg';
import { Button } from "../components/Button";
import { RoomCode } from '../components/RoomCode';
import { database } from '../services/firebase';
import '../styles/room.scss';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import deleteImg from '../assets/images/delete.svg';

type ParamsType = {
  id: string
};

const questionRemoved = () => toast.success('Question removed!');

export function AdminRoom() {
  const params = useParams<ParamsType>();
  const roomId = params.id;
  const history = useHistory();
  const { title, questions } = useRoom(roomId);


  const handleRemoveQuestion = async (questionId : string) => {
    if (window.confirm('Tem certeza que deseja remover essa pergunta?')) {
      await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove();
      questionRemoved();
    }
  }

  const handleCloseRoom = async () => {
    await database.ref(`/rooms/${roomId}`).update({ closedAt: new Date() });
    history.push('/');
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div className='buttons-header'>
            <RoomCode id={ roomId } />
            <Button isOutlined onClick={ handleCloseRoom }>Encerrar sala</Button>
          </div>
        </div>
      </header>

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
            >
              <button
                aria-label="Remover question"
                onClick={ () => handleRemoveQuestion(question.id)}
              >
                <img src={ deleteImg } alt="Remover perguta" />
              </button>
            </Question>))}
            <Toaster />
        </div>
      </main>
    </div>
  );
};