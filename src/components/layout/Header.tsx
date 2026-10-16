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
  HomeRegular
} from '@fluentui/react-icons';
import { LOGO_CIES_BASE64 } from '../../assets/image/cies/logoCiesDataUri';
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
  const isHomeActive = location.pathname === '/' || location.pathname === '' || location.pathname === '/%2F' || location.pathname === '/home';

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
          <img
            src={LOGO_CIES_BASE64}
            alt="Logo CIES"
            style={{
              height: '42px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
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

      {/* Lado Derecho: Botón de Perfil M365 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

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
            backgroundColor: isProfileActive ? '#f0f6ff' : '#f8f9fa',
            border: isProfileActive ? '1px solid #c7dffc' : '1px solid #edebe9',
            boxShadow: isProfileActive ? '0 1px 4px rgba(0, 120, 212, 0.12)' : 'none',
            transition: 'all 0.15s ease-in-out',
            cursor: 'pointer'
          }}
        >
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
              <Text weight="semibold" size={300} style={{ color: '#201f1e' }}>
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
            <Text size={200} style={{ color: '#605e5c', display: 'block', marginTop: '2px' }}>
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
