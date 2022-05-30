import emptyQuestionsImg from '../assets/images/empty-questions.svg';
import '../styles/emptyQuestion.scss';

type EmptyQuestionsType = {
  emptyRoomText: string,
}

export function EmptyQuestions({ emptyRoomText } : EmptyQuestionsType) {
  return (
    <div className="empty-room">
      <img src={ emptyQuestionsImg } alt="Perguntas vazias" />
      <h2>Nenhuma pergunta por aqui...</h2>
      <h3>{ emptyRoomText }</h3>
    </div>
  );
}