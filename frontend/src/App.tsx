import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Logged from './pages/Logged';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={ <Navigate to='/user/register' /> } />
        <Route path='/user/register' element={<Register />}/>
        <Route path='/user/login' element={<Login />}/>
        <Route path='/user/logged' element={<Logged />}/>
      </Routes>
    </Router>
  );
}

export default App;
