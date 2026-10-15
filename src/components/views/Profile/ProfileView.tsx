import * as React from 'react';
import {
  Title2,
  Title3,
  Body1,
  Card,
  Badge,
  Text,
  Button
} from '@fluentui/react-components';
import {
  ShieldCheckmarkRegular,
  PersonAvailableRegular,
  DocumentTableRegular,
  LinkRegular
} from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import { IUserGraphProfile } from '../../../services/graphService';
import { IUserSecurityInfo } from '../../../services/spService';

interface IProfileViewProps {
  profile?: IUserGraphProfile;
  security?: IUserSecurityInfo;
}

export const ProfileView: React.FC<IProfileViewProps> = ({ profile, security }) => {
  const isSuperAdmin = security?.isSuperAdmin;
  const isAdmin = security?.isAdmin;

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Banner de Bienvenida Personalizado */}
      <Card style={{
        padding: '28px',
        background: 'linear-gradient(135deg, #0078d4 0%, #004578 100%)',
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 120, 212, 0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9 }}>
              Información de Usuario & Sesión M365
            </span>
            <Title2 style={{ color: '#ffffff', margin: '4px 0 8px 0', display: 'block' }}>
              Hola, {profile?.displayName || security?.displayName || 'Colaborador'} 👋
            </Title2>
            <Body1 style={{ color: '#e1dfdd', maxWidth: '600px', display: 'block' }}>
              Puesto: <strong>{profile?.jobTitle || 'CIES'}</strong> | Departamento: <strong>{profile?.department || 'General'}</strong>
            </Body1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <Badge
              appearance="filled"
              color={isSuperAdmin ? 'danger' : isAdmin ? 'informative' : 'subtle'}
              size="large"
            >
              {isSuperAdmin ? '🛡️ Super Administrador' : isAdmin ? '⚙️ Administrador' : '👤 Colaborador CIES'}
            </Badge>
            <span style={{ fontSize: '12px', color: '#c7e0f4' }}>
              {profile?.mail || security?.email}
            </span>
          </div>
        </div>
      </Card>

      {/* Resumen de Estado de Seguridad y Conexión */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <Card style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <PersonAvailableRegular style={{ fontSize: '24px', color: '#107c10' }} />
            <Title3>Conexión Microsoft 365</Title3>
          </div>
          <Body1 style={{ color: '#605e5c', marginBottom: '12px' }}>
            Tu sesión está autenticada y vinculada a través de Microsoft Graph API.
          </Body1>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', color: '#323130' }}>
            <div><strong>Nombre:</strong> {profile?.displayName}</div>
            <div><strong>Correo:</strong> {profile?.mail}</div>
            <div><strong>Estado Graph:</strong> <Badge color="success">Activo</Badge></div>
          </div>
        </Card>

        <Card style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <ShieldCheckmarkRegular style={{ fontSize: '24px', color: '#0078d4' }} />
            <Title3>Grupos y Permisos</Title3>
          </div>
          <Body1 style={{ color: '#605e5c', marginBottom: '12px' }}>
            Roles y grupos de seguridad asignados a tu cuenta en SharePoint.
          </Body1>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {security?.roles && security.roles.length > 0 ? (
              security.roles.map(r => (
                <Badge key={r} color="informative" appearance="tint">{r}</Badge>
              ))
            ) : (
              <Text size={200} style={{ color: '#605e5c' }}>Sin grupos adicionales (Acceso General)</Text>
            )}
          </div>
          {(isSuperAdmin || isAdmin) && (
            <Link to="/admin" style={{ textDecoration: 'none' }}>
              <Button appearance="outline" size="small" icon={<LinkRegular />}>
                Ir al Panel de Control de Roles
              </Button>
            </Link>
          )}
        </Card>

        <Card style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <DocumentTableRegular style={{ fontSize: '24px', color: '#8764b8' }} />
            <Title3>Formularios de Solicitudes</Title3>
          </div>
          <Body1 style={{ color: '#605e5c', marginBottom: '12px' }}>
            Acceso centralizado a solicitudes de Uber, Viajes, Soporte TI y Bienes y Servicios.
          </Body1>
          <Text size={200} style={{ color: '#605e5c' }}>
            Conectado a la lista de Formularios de SharePoint CIES.
          </Text>
        </Card>
      </div>
    </div>
  );
};
