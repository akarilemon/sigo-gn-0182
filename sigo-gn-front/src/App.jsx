import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Layout from './components/Layout';
import RutaProtegida from './components/RutaProtegida.jsx';
import AuthProvider from './context/AuthContext.jsx';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';  
import './App.css';


function App() {
  return (
    <AuthProvider>
      <Layout>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<RutaProtegida/>}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </Layout>
    </AuthProvider>
  );
}

export default App;
