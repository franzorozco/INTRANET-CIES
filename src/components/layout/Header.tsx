import * as React from 'react';
import {
  Avatar,
  Badge,
  Text
} from '@fluentui/react-components';
import { ShieldCheckmarkRegular, CloudCheckmarkRegular } from '@fluentui/react-icons';
import { IUserGraphProfile } from '../../services/graphService';
import { IUserSecurityInfo } from '../../services/spService';

interface IHeaderProps {
  profile?: IUserGraphProfile;
  security?: IUserSecurityInfo;
}

export const Header: React.FC<IHeaderProps> = ({ profile, security }) => {
  const isSuperAdmin = security?.isSuperAdmin;
  const isAdmin = security?.isAdmin;

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

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 24px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e1dfdd',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      {/* Logotipo y Título de la Intranet */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
      </div>

      {/* Perfil del Usuario Logueado (Microsoft Graph + Roles) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
            <Text weight="semibold" size={300} style={{ color: '#323130' }}>
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
      </div>
    </header>
  );
};
