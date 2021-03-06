import { Dispatch, SetStateAction, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "./Button";
import returnImg from '../assets/images/return.svg';
import '../styles/answerQuestion.scss';
import { database } from "../services/firebase";

const replySent = () => toast.success('Reply sent!');

type AnswerType = {
  content: string,
  roomId: string,
  questionId: string,
  setIsAnswering: Dispatch<SetStateAction<boolean>>
}

type EventType = {
  preventDefault: () => void,
}

export function AnswerQuestion({
  content,
  roomId,
  questionId,
  setIsAnswering
} : AnswerType) {
  const [answer, setAnswer] = useState<string>('');

  const handleSubmit = async (event : EventType) => {
    event.preventDefault();

    await database
      .ref(`rooms/${roomId}/questions/${questionId}/answers`).push(answer);
    
    replySent();
    setIsAnswering(false);
  }

  return (
    <div id="answer-question">
      <form onSubmit={ handleSubmit }>
        <button type="button" className="return" onClick={ () => setIsAnswering(false) }>
          <img src={ returnImg } alt="Retornar" />
        </button>
        <h3>{content}</h3>
        <textarea
          placeholder="Digite sua resposta!"
          value={ answer }
          onChange={ ({ target }) => setAnswer(target.value) }
        />
        <Button type="submit" disabled={ !answer }>Responder</Button>
      </form>
      <Toaster />
    </div>
  );
}