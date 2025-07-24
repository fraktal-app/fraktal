import { createRoot } from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom';
import './index.css'
import FlowEdit from "./pages/FlowEdit";
import App from './pages/App'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard';

createRoot(document.getElementById('root')!).render(
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/workflow-editor/:workflowId" element={<FlowEdit />} />

      </Routes>
    </HashRouter>
)
