import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import UserPage from './UserPage';
import AdminPage from './AdminPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <nav className="nav glass-card">
            <div style={{fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{fontSize: '2rem'}}>☕</span> Cafe Luxe
            </div>
            <div>
                <Link to="/">Menu</Link>
                <Link to="/admin">Admin</Link>
            </div>
        </nav>
        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
