import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth, LoginRoute, EmployerOnly, EmployeeOnly } from './components/AuthRoutes';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import NotFound from './pages/NotFound';
import JobPage, { jobLoader } from './pages/JobPage';
import AddjobPage from './pages/AddjobPage';
import EditJobPage from './pages/EditJobPage';
import ContactPage from './pages/ContactPage';
import ApplyJobPage from './pages/ApplyJobPage';
import ApplicationsPage, { applicationsLoader } from './pages/ApplicationsPage';
import { api } from './utils/api';

const App = () => {
  const addJob = async (newJob) => {
    await api.post('/api/jobs', newJob);
  };

  const deleteJob = async (id) => {
    await api.delete(`/api/jobs/${id}`);
  };

  const updateJob = async (job) => {
    await api.put(`/api/jobs/${job.id}`, job);
  };

  const router = createBrowserRouter([
    {
      path: '/login',
      element: <LoginRoute />,
    },
    {
      path: '/',
      element: <RequireAuth />,
      children: [
        {
          element: <MainLayout />,
          children: [
            {
              index: true,
              element: (
                <EmployerOnly>
                  <HomePage />
                </EmployerOnly>
              ),
            },
            { path: 'jobs', element: <JobsPage /> },
            {
              path: 'jobs/:id/apply',
              element: (
                <EmployeeOnly>
                  <ApplyJobPage />
                </EmployeeOnly>
              ),
              loader: jobLoader,
            },
            {
              path: 'jobs/:id',
              element: <JobPage deleteJob={deleteJob} />,
              loader: jobLoader,
            },
            {
              path: 'applications',
              element: (
                <EmployerOnly>
                  <ApplicationsPage />
                </EmployerOnly>
              ),
              loader: applicationsLoader,
            },
            { path: 'contact', element: <ContactPage /> },
            {
              path: 'add-job',
              element: (
                <EmployerOnly>
                  <AddjobPage addJobSubmit={addJob} />
                </EmployerOnly>
              ),
            },
            {
              path: 'edit-job/:id',
              element: (
                <EmployerOnly>
                  <EditJobPage updatedJobSubmit={updateJob} />
                </EmployerOnly>
              ),
              loader: jobLoader,
            },
            { path: '*', element: <NotFound /> },
          ],
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
