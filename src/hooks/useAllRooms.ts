import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAuth } from "./useAuth";

type RoomsValuesTypes = {
  title: string;
}

type RoomsType = {
  roomId: string,
  title: string,
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
      }))
      setRooms(arrayRooms);
      setIsFetching(false);
    }
    getRooms();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { rooms };
}