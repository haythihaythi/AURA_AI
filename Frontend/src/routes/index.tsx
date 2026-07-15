import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../app/AppShell'
import ApplicationFormBuilder from '../pages/ApplicationFormBuilder'
import JobDetail from '../pages/JobDetail'
import Jobs from '../pages/Jobs'
import Login from '../pages/Login'
import PublicJobApplication from '../pages/PublicJobApplication'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jobs" replace />} />
      <Route path="/login" element={<Login />} />

      <Route element={<AppShell />}>
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:jobId" element={<JobDetail />} />
        <Route
          path="/jobs/:jobId/application-form"
          element={<ApplicationFormBuilder />}
        />
      </Route>

      <Route path="/apply/:jobId" element={<PublicJobApplication />} />
    </Routes>
  )
}
