import './App.css';
import Home from './components/Home';
import { Login } from './components/Login';
import { Profile } from './components/Profile';
import { Register } from "./components/Register";
import { OTP } from './components/OTP';
import { PasswordReset } from "./components/PasswordReset";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { TasksShow } from './components/TasksShow';
import { Chat } from './components/Chat';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/Login' element={<Login />} />
          <Route exact path='/Register' element={<Register />} />
          <Route exact path='/Profile' element={<Profile />} />
          <Route exact path='/OTP' element={<OTP />} />
          <Route exact path='/Chat' element={<Chat />} />
          <Route exact path='/PasswordReset' element={<PasswordReset />} />
          <Route exact path='/TasksShow' element={<TasksShow />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
