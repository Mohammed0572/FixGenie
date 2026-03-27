import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewReport from './pages/NewReport';
import ResultsPage from './pages/ResultsPage';
import BugQueue from './pages/BugQueue';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Protected Area Wrapped in Layout */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new" element={<NewReport />} />
            <Route path="/analyze" element={<ResultsPage />} />
            <Route path="/bugs" element={<BugQueue />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
