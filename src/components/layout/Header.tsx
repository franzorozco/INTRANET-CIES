import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Text,
  Button
} from '@fluentui/react-components';
import {
  ShieldCheckmarkRegular,
  CloudCheckmarkRegular,
  HomeRegular,
  ShieldKeyholeRegular
} from '@fluentui/react-icons';
import { IUserGraphProfile } from '../../services/graphService';
import { IUserSecurityInfo } from '../../services/spService';
import { INTRANET_ADMIN_ROLE } from '../../constants/roles';

interface IHeaderProps {
  profile?: IUserGraphProfile;
  security?: IUserSecurityInfo;
}

export const Header: React.FC<IHeaderProps> = ({ profile, security }) => {
  const location = useLocation();
  const isSuperAdmin = security?.isSuperAdmin;
  const isAdmin = security?.isAdmin || security?.roles?.indexOf(INTRANET_ADMIN_ROLE) !== -1;

  const roleLabel = isSuperAdmin
    ? 'Super Admin'
    : isAdmin
    ? 'Administrador'
    : 'Colaborador';

  const roleColor = isSuperAdmin
    ? 'danger'
    : isAdmin
    ? 'informative'
    : 'subtle';

  const isProfileActive = location.pathname === '/perfil';
  const isAdminActive = location.pathname === '/admin';
  const isHomeActive = location.pathname === '/';

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 24px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e1dfdd',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Logotipo y Título de la Intranet */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', color: 'inherit' }}>
          <div style={{
            backgroundColor: '#0078d4',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '18px',
            padding: '6px 14px',
            borderRadius: '6px',
            letterSpacing: '1px'
          }}>
            CIES
          </div>
          <div>
            <Text weight="bold" size={400} style={{ color: '#201f1e', display: 'block' }}>
              INTRANET CORPORATIVA
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <CloudCheckmarkRegular style={{ color: '#107c10', fontSize: '14px' }} />
              <Text size={200} style={{ color: '#605e5c' }}>
                {profile?.isGraphConnected ? 'Conectado a Microsoft 365 (Graph)' : 'SharePoint Online'}
              </Text>
            </div>
          </div>
        </Link>

        {/* Botón para volver a Inicio si no está en la página principal */}
        {!isHomeActive && (
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button appearance="subtle" icon={<HomeRegular />} size="small">
              Inicio
            </Button>
          </Link>
        )}
      </div>

      {/* Lado Derecho: Control de Roles y Botón de Perfil M365 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Acceso al Panel de Roles para administradores */}
        {(isSuperAdmin || isAdmin) && (
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <Button
              icon={<ShieldKeyholeRegular />}
              appearance={isAdminActive ? 'primary' : 'subtle'}
              size="medium"
            >
              Control de Roles
            </Button>
          </Link>
        )}

        {/* Botón interactivo de Mi Perfil & M365 (Pasantia Sistemas / Foto) */}
        <Link
          to="/perfil"
          title="Ver Mi Perfil & Sesión M365"
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '6px 12px',
            borderRadius: '8px',
            backgroundColor: isProfileActive ? '#edf5fd' : '#f9f9f9',
            border: isProfileActive ? '1px solid #0078d4' : '1px solid #edebe9',
            transition: 'all 0.15s ease-in-out',
            cursor: 'pointer'
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
              <Text weight="semibold" size={300} style={{ color: isProfileActive ? '#0078d4' : '#323130' }}>
                {profile?.displayName || security?.displayName || 'Cargando...'}
              </Text>
              <Badge
                appearance="filled"
                color={roleColor as any}
                icon={isSuperAdmin || isAdmin ? <ShieldCheckmarkRegular /> : undefined}
                size="small"
              >
                {roleLabel}
              </Badge>
            </div>
            <Text size={200} style={{ color: '#605e5c', display: 'block', marginTop: '1px' }}>
              {profile?.jobTitle || 'CIES'} {profile?.department ? `• ${profile.department}` : ''}
            </Text>
          </div>

          {/* Avatar oficial de Microsoft 365 */}
          <Avatar
            name={profile?.displayName || security?.displayName || 'U'}
            image={profile?.photoUrl ? { src: profile.photoUrl } : undefined}
            size={40}
            color="brand"
          />
        </Link>
      </div>
    </header>
  );
};
