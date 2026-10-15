import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@fluentui/react-components';
import {
  HomeRegular,
  HomeFilled,
  PersonRegular,
  PersonFilled,
  ShieldKeyholeRegular,
  ShieldKeyholeFilled
} from '@fluentui/react-icons';
import { INTRANET_ADMIN_ROLE } from '../../constants/roles';

interface ISidebarProps {
  roles: string[];
  isSuperAdmin?: boolean;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<ISidebarProps> = ({ roles, isSuperAdmin = false, isAdmin = false }) => {
  const location = useLocation();
  const hasAdminAccess = isSuperAdmin || isAdmin || roles.indexOf(INTRANET_ADMIN_ROLE) !== -1;

  const isHomeActive = location.pathname === '/';
  const isProfileActive = location.pathname === '/perfil';
  const isAdminActive = location.pathname === '/admin';

  return (
    <aside style={{
      width: '240px',
      borderRight: '1px solid #edebe9',
      padding: '16px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      backgroundColor: '#faf9f8'
    }}>
      <div style={{ padding: '4px 12px', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#a19f9d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Navegación
        </span>
      </div>

      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button
          icon={isHomeActive ? <HomeFilled style={{ color: '#0078d4' }} /> : <HomeRegular />}
          appearance={isHomeActive ? 'subtle' : 'transparent'}
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            fontWeight: isHomeActive ? 600 : 400,
            backgroundColor: isHomeActive ? '#edebe9' : 'transparent'
          }}
        >
          Inicio
        </Button>
      </Link>

      <Link to="/perfil" style={{ textDecoration: 'none' }}>
        <Button
          icon={isProfileActive ? <PersonFilled style={{ color: '#0078d4' }} /> : <PersonRegular />}
          appearance={isProfileActive ? 'subtle' : 'transparent'}
          style={{
            width: '100%',
            justifyContent: 'flex-start',
            fontWeight: isProfileActive ? 600 : 400,
            backgroundColor: isProfileActive ? '#edebe9' : 'transparent'
          }}
        >
          Mi Perfil & M365
        </Button>
      </Link>

      {hasAdminAccess && (
        <>
          <div style={{ padding: '12px 12px 4px 12px', marginTop: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#a19f9d', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Gestión y Seguridad
            </span>
          </div>

          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <Button
              icon={isAdminActive ? <ShieldKeyholeFilled style={{ color: '#0078d4' }} /> : <ShieldKeyholeRegular />}
              appearance={isAdminActive ? 'subtle' : 'transparent'}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                fontWeight: isAdminActive ? 600 : 400,
                backgroundColor: isAdminActive ? '#edebe9' : 'transparent'
              }}
            >
              Control de Roles
            </Button>
          </Link>
        </>
      )}
    </aside>
  );
};