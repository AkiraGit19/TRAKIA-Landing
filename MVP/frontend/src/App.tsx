import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LiveOps from './pages/LiveOps'
import WorkerList from './pages/workers/WorkerList'
import WorkerDetail from './pages/workers/WorkerDetail'
import WorkerNew from './pages/workers/WorkerNew'
import CheckinList from './pages/checkins/CheckinList'
import TaskBoard from './pages/tasks/TaskBoard'
import TaskNew from './pages/tasks/TaskNew'
import IncidentList from './pages/incidents/IncidentList'
import IncidentNew from './pages/incidents/IncidentNew'
import IncidentDetail from './pages/incidents/IncidentDetail'
import DocumentList from './pages/documents/DocumentList'
import Reports from './pages/reports/Reports'
import Settings from './pages/settings/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="/live" element={<LiveOps />} />
          <Route path="/workers" element={<WorkerList />} />
          <Route path="/workers/new" element={<WorkerNew />} />
          <Route path="/workers/:id" element={<WorkerDetail />} />
          <Route path="/checkins" element={<CheckinList />} />
          <Route path="/tasks" element={<TaskBoard />} />
          <Route path="/tasks/new" element={<TaskNew />} />
          <Route path="/incidents" element={<IncidentList />} />
          <Route path="/incidents/new" element={<IncidentNew />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
          <Route path="/documents" element={<DocumentList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
