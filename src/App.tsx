import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContextProvider';
import { AdminRoom } from './pages/AdminRoom';
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';

function App() {

  return (
      <BrowserRouter>
        <AuthContextProvider>
          <Switch>
            <Route exact path="/Letme-Ask" component={ Home } />
            <Route exact path="/Letme-Ask/rooms/new" component={ NewRoom } />
            <Route exact path="/Letme-Ask/rooms/:id" component={ Room } />
            <Route exact path="/Letme-Ask/admin/rooms/:id" component={ AdminRoom } />
          </Switch>
        </AuthContextProvider>
      </BrowserRouter>
  );
}

export default App;
