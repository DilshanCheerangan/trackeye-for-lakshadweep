import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Athletes from './pages/Athletes';
import Competitions from './pages/Competitions';
import TrackEvents from './pages/TrackEvents';
import FieldEvents from './pages/FieldEvents';
import LiveCapture from './pages/LiveCapture';
import VideoAnalysis from './pages/VideoAnalysis';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Islands from './pages/Islands';
import Approvals from './pages/Approvals';
import StartLists from './pages/StartLists';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="athletes" element={<Athletes />} />
          <Route path="competitions" element={<Competitions />} />
          <Route path="islands" element={<Islands />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="start-lists" element={<StartLists />} />
          <Route path="track-events" element={<TrackEvents />} />
          <Route path="field-events" element={<FieldEvents />} />
          <Route path="live-capture" element={<LiveCapture />} />
          <Route path="video-analysis" element={<VideoAnalysis />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
