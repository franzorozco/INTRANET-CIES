import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import {
  Button,
  FluentProvider,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  webLightTheme
} from '@fluentui/react-components';
import { INTRANET_ADMIN_ROLE } from '../constants/roles';
import { getUserRoles } from '../services/spService';
import { ProtectedRoute } from './shared/ProtectedRoute';
import { Sidebar } from './layout/Sidebar';
import { HomeView } from './views/Home/HomeView';
import { AdminView } from './views/Admin/AdminView';

export const App: React.FC = () => {
  const [roles, setRoles] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<boolean>(false);
  const [loadAttempt, setLoadAttempt] = React.useState<number>(0);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError(false);

    getUserRoles().then(
      (userRoles) => {
        if (isMounted) {
          setRoles(userRoles);
          setLoading(false);
        }
      },
      (err: unknown) => {
        console.error('Error al obtener grupos de SharePoint:', err);
        if (isMounted) {
          setRoles([]);
          setLoadError(true);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [loadAttempt]);

  return (
    <FluentProvider theme={webLightTheme}>
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <Spinner label="Cargando permisos y entorno..." />
        </div>
      ) : loadError ? (
        <div style={{ padding: '24px' }}>
          <MessageBar intent="error">
            <MessageBarTitle>No se pudieron cargar los permisos</MessageBarTitle>
            <MessageBarBody>
              Verifica tu conexión con SharePoint e inténtalo de nuevo.
            </MessageBarBody>
          </MessageBar>
          <Button
            appearance="primary"
            onClick={() => setLoadAttempt((attempt) => attempt + 1)}
            style={{ marginTop: '16px' }}
          >
            Reintentar
          </Button>
        </div>
      ) : (
        <HashRouter>
          <div style={{ display: 'flex', minHeight: '85vh' }}>
            <Sidebar roles={roles} />
            <main style={{ flex: 1, backgroundColor: '#f3f2f1' }}>
              <Routes>
                <Route path="/" element={<HomeView />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute userRoles={roles} requiredRole={INTRANET_ADMIN_ROLE}>
                      <AdminView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="*"
                  element={
                    <div style={{ padding: '24px' }}>
                      <MessageBar intent="warning">
                        <MessageBarTitle>Página no encontrada</MessageBarTitle>
                        <MessageBarBody>La dirección solicitada no existe en esta intranet.</MessageBarBody>
                      </MessageBar>
                    </div>
                  }
                />
              </Routes>
            </main>
          </div>
        </HashRouter>
      )}
    </FluentProvider>
  );
};