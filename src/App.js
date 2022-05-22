import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Admin from './Pages/Admin';
import ProtectedRoute from './ProtectedRouter';
import Chat from './Pages/Chat'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar';
import Message from './components/Message';
import Confirm from './Pages/Confirm';
import RequireAuth from './RequireAuth';
import RequireAuthAdmin from './RequireAuthAdmin';
import HandleRedirect from './HandleRedirect';
import Feed from './components/Feed';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/register" element={<SignUp />}></Route>
      <Route path="/handle-redirect" element={<HandleRedirect />}></Route>
      <Route
        path="/chat"
        element={
          <RequireAuth>
            <Chat />
          </RequireAuth>
        }
      ></Route>
      <Route
        path="/admin"
        element={
          <RequireAuthAdmin>
            <Admin />
          </RequireAuthAdmin>
        }
      ></Route>
      <Route path='confirm-email/:userId' element={<Confirm />} />
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>404</p>
          </main>
        }
      />
    </Routes>

  );
}

export default App;
