// import logo from './logo.svg';
import { Route, Routes } from 'react-router-dom';
import './App.css';

import Login from './components/Login'; 
import MainContainer from './components/MainContainer';
import Welcome from './components/Welcome';
import Users from './components/Users';
import Groups from './components/Groups';
import CreateGroup from './components/CreateGroup';
import ChatArea from './components/ChatArea';
import Signup from './components/Signup';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign" element={<Signup />} />
        <Route path="app" element={<MainContainer />}>
          <Route path="welcome" element={<Welcome />} />
          <Route path="chat" element={<ChatArea />} />
          <Route path="users" element={<Users />} />
          <Route path="groups" element={<Groups />} />
          <Route path="creategroup" element={<CreateGroup />} />
        
        </Route>
      </Routes>
      
    </div>
  );
}

export default App;