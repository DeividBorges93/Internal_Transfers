import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';


function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={ <Navigate to='/user/register' /> } />
        <Route path='/user/register' element={<Register />}/>
        <Route path='/user/login' element={<Login />}/>
      </Routes>
    </Router>
  );
}

export default App;
