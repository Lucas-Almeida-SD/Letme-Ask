import { useAllRooms } from "../hooks/useAllRooms";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/Loading";

import logoImg from '../assets/images/logo.svg';

import '../styles/allRooms.scss';
import { RoomCode } from "../components/RoomCode";

export function AllRooms() {
  const { rooms } = useAllRooms();
  const { isFetching } = useAuth();
  console.log(rooms);
  
  return (
    <div id="all-rooms">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
        </div>
      </header>
      <main>
        <h2>Salas</h2>
        <div className="rooms-list">
          {(!isFetching) ? (
            rooms.map((room) => (
            <div key={ room.roomId } className="rooms">
              <p><strong>Nome:</strong> {room.title}</p>
              <RoomCode id={ room.roomId } />
            </div>))
          ) : <Loading />}

        </div>
      </main>
    </div>
  );
}