import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme, Spinner } from '@fluentui/react-components';
import { getUserRoles } from '../services/spService';
import { ProtectedRoute } from './shared/ProtectedRoute';
import { Sidebar } from './layout/Sidebar';
import { HomeView } from './views/Home/HomeView';
import { AdminView } from './views/Admin/AdminView';

export const App: React.FC = () => {
  const [roles, setRoles] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    getUserRoles()
      .then((userRoles) => {
        setRoles(userRoles);
      })
      .catch((err) => {
        console.error('Error al obtener grupos de SharePoint:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Spinner label="Cargando permisos y entorno..." />
      </div>
    );
  }

  return (
    <FluentProvider theme={webLightTheme}>
      <HashRouter>
        <div style={{ display: 'flex', minHeight: '85vh' }}>
          <Sidebar roles={roles} />
          <main style={{ flex: 1, backgroundColor: '#f3f2f1' }}>
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute userRoles={roles} requiredRole="Intranet_Admin">
                    <AdminView />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </FluentProvider>
  );
};