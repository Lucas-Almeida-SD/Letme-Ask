import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type Questions = {
  id: string,
  content:string,
  author: { name: string, avatar: string },
  isHighlighted: boolean,
  isAnswered: boolean,
  likeCount: number,
  likeId: string | undefined,
}

type FirebaseQuestions = Record<string,{
  content:string,
  author: { name: string, avatar: string },
  isHighlighted: boolean,
  isAnswered: boolean,
  likes: Record<string, {
    authorId: string
  }>
}>

export function useRoom(roomId : string) {
  const { user, setIsFetching } = useAuth();
  const [questions, setQuestions] = useState<Questions[]>([])
  const [title, setTitle] = useState('');

  useEffect(() => {
    setIsFetching(true);
    const roomRef = database.ref(`/rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions : FirebaseQuestions = databaseRoom.questions ?? {};
      
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => ({
        id: key,
        content: value.content,
        author: value.author,
        isHighlighted: value.isHighlighted,
        isAnswered: value.isAnswered,
        likeCount: Object.values(value.likes ?? {}).length,
        likeId:  Object.entries(value.likes ?? {})
          .find(([key, like]) => like.authorId === (user?.id))?.[0],
      }));
      
      setTitle(databaseRoom.title);
      setQuestions(parsedQuestions.reverse());
      setIsFetching(false);
    });

    return () => {
      roomRef.off('value');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, user?.id]);

  return { title, questions };
}