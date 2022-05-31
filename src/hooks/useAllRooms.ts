import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type RoomsValuesTypes = {
  title: string;
  authorId: string,
  authorName: string,
  authorImage: string,
  closedAt: string | undefined,
}

type RoomsType = {
  roomId: string,
  title: string,
  authorId: string,
  authorName: string,
  authorImage: string,
  closed: boolean,
};


export function useAllRooms() {
  const { setIsFetching } = useAuth();
  const [rooms, setRooms] = useState<RoomsType[]>([]);

  useEffect(() => {
    setIsFetching(true);
    const getRooms = async () => {
      const roomsRef = await database.ref('rooms').get();
      const roomsValues = roomsRef.val();
      const arrayRooms  = Object.entries<RoomsValuesTypes>(roomsValues).map(([key, value]) => ({
        roomId: key,
        title: value.title,
        authorId: value.authorId,
        authorName: value.authorName,
        authorImage: value.authorImage,
        closed: (value.closedAt) ? true : false,
      }))
      setRooms(arrayRooms);
      setIsFetching(false);
    }
    getRooms();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rooms };
}