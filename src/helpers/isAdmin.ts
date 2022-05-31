import { database } from "../services/firebase";

type UserType = { id: string } | undefined;

type HistoryType = { push: (arg: string)  => void };

export async function isAdmin(roomId : string, user : UserType, history : HistoryType) {
  const roomRef = await database.ref(`rooms/${roomId}`).get();
  const roomSelected = roomRef.val();
  
  if (roomSelected.authorId === user?.id) {
    history.push(`/Letme-Ask/admin/rooms/${roomId}`);
  } else {
    history.push(`/Letme-Ask/rooms/${roomId}`);
  }
}