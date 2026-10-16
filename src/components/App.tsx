import * as React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  Button,
  FluentProvider,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Spinner,
  webLightTheme
} from '@fluentui/react-components';
import type { WebPartContext } from '@microsoft/sp-webpart-base';
import { INTRANET_ADMIN_ROLE, INTRANET_SUPERADMIN_ROLE } from '../constants/roles';
import { getCurrentUserSecurity, getSP, IUserSecurityInfo } from '../services/spService';
import { getUserGraphProfile, IUserGraphProfile } from '../services/graphService';
import { ProtectedRoute } from './shared/ProtectedRoute';
import { Header } from './layout/Header';
import { HomeView } from './views/Home/HomeView';
import { ProfileView } from './views/Profile/ProfileView';
import { AdminView } from './views/Admin/AdminView';

export interface IAppProps {
  context?: WebPartContext;
}

export const App: React.FC<IAppProps> = ({ context }) => {
  const [security, setSecurity] = React.useState<IUserSecurityInfo | null>(null);
  const [profile, setProfile] = React.useState<IUserGraphProfile | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [loadAttempt, setLoadAttempt] = React.useState<number>(0);

  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setLoadError(null);

    // Inicializar PnPjs si tenemos contexto
    if (context) {
      try {
        getSP(context);
      } catch (e) {
        console.warn('Error inicializando SP:', e);
      }
    }

    // Cargar perfil de Microsoft Graph y permisos de SharePoint en paralelo
    const loadData = async () => {
      try {
        const [secData, graphData] = await Promise.all([
          getCurrentUserSecurity(context),
          context ? getUserGraphProfile(context) : Promise.resolve(null)
        ]);

        if (isMounted) {
          setSecurity(secData);
          setProfile(graphData);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error al cargar datos de seguridad o Microsoft Graph:', err);
        if (isMounted) {
          setLoadError(err?.message || 'Error al conectar con SharePoint / Microsoft 365.');
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [context, loadAttempt]);

  return (
    <FluentProvider theme={webLightTheme}>
      <div style={{ fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif', backgroundColor: '#f3f2f1', minHeight: '85vh', width: '100%' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '350px', gap: '12px' }}>
            <Spinner size="large" label="Conectando con Microsoft Graph y SharePoint..." />
          </div>
        ) : loadError ? (
          <div style={{ padding: '24px', maxWidth: '600px', margin: '40px auto' }}>
            <MessageBar intent="error">
              <MessageBarTitle>No se pudieron cargar los datos de la Intranet</MessageBarTitle>
              <MessageBarBody>
                {loadError}
              </MessageBarBody>
            </MessageBar>
            <Button
              appearance="primary"
              onClick={() => setLoadAttempt((attempt) => attempt + 1)}
              style={{ marginTop: '16px' }}
            >
              Reintentar Conexión
            </Button>
          </div>
        ) : (
          <HashRouter>
            {/* Encabezado con logotipo, controles y perfil de Microsoft Graph */}
            <Header profile={profile || undefined} security={security || undefined} />

            {/* Contenido principal full-width (sin barra lateral de navegación) */}
            <main style={{ width: '100%', minHeight: 'calc(85vh - 65px)' }}>
              <Routes>
                <Route path="/" element={<HomeView context={context} />} />
                <Route path="/home" element={<HomeView context={context} />} />
                <Route path="/%2F" element={<Navigate to="/" replace />} />
                <Route
                  path="/perfil"
                  element={<ProfileView profile={profile || undefined} security={security || undefined} context={context} />}
                />
                <Route
                  path="/admin"
                  element={
                      <ProtectedRoute
                        userRoles={security?.roles || []}
                        isSuperAdmin={security?.isSuperAdmin}
                        requiredRole={INTRANET_SUPERADMIN_ROLE}
                      >
                        <AdminView />
                      </ProtectedRoute>
                  }
                />
                {/* Cualquier otra ruta o hash residual redirige inmediatamente a la página principal */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </HashRouter>
        )}
      </div>
    </FluentProvider>
  );
};