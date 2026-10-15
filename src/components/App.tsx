import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import type { WebPartContext } from '@microsoft/sp-webpart-base';
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
import { HomeView } from './views/Home/HomeView';
import { AdminView } from './views/Admin/AdminView';

interface IAppProps {
  context: WebPartContext;
}

export const App: React.FC<IAppProps> = ({ context }) => {
  const [roles, setRoles] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | undefined>();
  const [loadAttempt, setLoadAttempt] = React.useState<number>(0);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError(undefined);

    getUserRoles(context).then(
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
          setLoadError(err instanceof Error ? err.message : 'Error inesperado al consultar SharePoint.');
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [context, loadAttempt]);

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
              {loadError} Verifica tu conexión y permisos de SharePoint e inténtalo de nuevo.
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
          <div style={{ minHeight: '85vh', width: '100%' }}>
            <main style={{ width: '100%', backgroundColor: '#f3f2f1' }}>
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