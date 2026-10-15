import * as React from 'react';
import {
  Title1,
  Title2,
  Title3,
  Subtitle1,
  Body1,
  Body2,
  Card,
  Badge,
  Avatar,
  Button,
  Divider,
  Text
} from '@fluentui/react-components';
import {
  ShieldCheckmarkRegular,
  ShieldKeyholeRegular,
  LockClosedRegular,
  MailRegular,
  CallRegular,
  LocationRegular,
  BuildingRegular,
  BriefcaseRegular,
  PersonRegular,
  KeyRegular,
  CheckmarkCircleRegular,
  CloudCheckmarkRegular,
  ArrowRightRegular,
  CopyRegular
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
  const [copied, setCopied] = React.useState<boolean>(false);

  const displayName = profile?.displayName || security?.displayName || 'Usuario';
  const email = profile?.mail || security?.email || 'No disponible';
  const upn = profile?.userPrincipalName || security?.loginName || email;
  const jobTitle = profile?.jobTitle || 'Colaborador CIES';
  const department = profile?.department || 'General';
  const office = profile?.officeLocation || 'Oficina Nacional';
  const phone = profile?.mobilePhone || 'No registrado';
  const company = profile?.companyName || 'CIES Salud Sexual Salud Reproductiva';

  const handleCopyEmail = () => {
    if (email && email !== 'No disponible') {
      navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 1. TARJETA HERO PRINCIPAL - PORTADA Y PERFIL EJECUTIVO */}
      <Card style={{
        padding: '0',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #e1dfdd',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        backgroundColor: '#ffffff'
      }}>
        {/* Banner superior con gradiente institucional CIES */}
        <div style={{
          height: '140px',
          background: 'linear-gradient(135deg, #0f2a3a 0%, #1f4a5c 50%, #2f7a6b 100%)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c7e0f4', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>
            <CloudCheckmarkRegular style={{ color: '#8cc63f', fontSize: '18px' }} />
            <span>DIRECTORIO CORPORATIVO CIES</span>
          </div>

          <Badge
            appearance="tint"
            color="informative"
            icon={<LockClosedRegular />}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', border: 'none' }}
          >
            Datos sincronizados con Microsoft 365 (Solo Lectura)
          </Badge>
        </div>

        {/* Bloque de identidad del usuario con Avatar solapado */}
        <div style={{ padding: '0 32px 24px 32px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            marginTop: '-44px',
            marginBottom: '18px'
          }}>
            {/* Avatar Oficial M365 + Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
              {/* Avatar Oficial M365 */}
              <div style={{
                borderRadius: '50%',
                padding: '4px',
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.16)',
                display: 'flex',
                flexShrink: 0
              }}>
                <Avatar
                  name={displayName}
                  image={profile?.photoUrl ? { src: profile.photoUrl } : undefined}
                  size={96}
                  color="brand"
                />
              </div>

              {/* Contenedor del Nombre, Rol y Datos Laborales */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                paddingTop: '44px' /* Alinea perfectamente el texto en el área blanca */
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <Title1 style={{ color: '#1a1a1a', margin: 0, fontWeight: 700, fontSize: '26px', lineHeight: '32px' }}>
                    {displayName}
                  </Title1>
                  <Badge
                    appearance="filled"
                    color={isSuperAdmin ? 'danger' : isAdmin ? 'informative' : 'brand'}
                    size="medium"
                    icon={isSuperAdmin || isAdmin ? <ShieldCheckmarkRegular /> : <PersonRegular />}
                  >
                    {isSuperAdmin ? 'Super Administrador' : isAdmin ? 'Administrador' : 'Colaborador CIES'}
                  </Badge>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <BriefcaseRegular style={{ color: '#0078d4', fontSize: '16px' }} />
                    <span style={{ fontWeight: 600, color: '#212529' }}>{jobTitle}</span>
                  </div>
                  <span style={{ color: '#ced4da' }}>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <BuildingRegular style={{ color: '#107c41', fontSize: '16px' }} />
                    <span style={{ color: '#495057' }}>{department}</span>
                  </div>
                  <span style={{ color: '#ced4da' }}>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <LocationRegular style={{ color: '#d83b01', fontSize: '16px' }} />
                    <span style={{ color: '#495057' }}>{office}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Acceso a Roles EXCLUSIVO para Super Administradores */}
            {isSuperAdmin && (
              <div style={{ paddingTop: '44px' }}>
                <Link to="/admin" style={{ textDecoration: 'none' }}>
                  <Button
                    appearance="primary"
                    icon={<ShieldKeyholeRegular />}
                    size="medium"
                    style={{
                      backgroundColor: '#a80000',
                      borderColor: '#a80000',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(168, 0, 0, 0.25)'
                    }}
                  >
                    Panel de Control de Roles
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <Divider style={{ margin: '14px 0 18px 0' }} />

          {/* Cinta de datos rápidos (Quick Facts) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '12px 16px', backgroundColor: '#f9f9f9', borderRadius: '10px', border: '1px solid #edebe9' }}>
              <Text size={200} style={{ color: '#605e5c', display: 'block', fontWeight: 600, fontSize: '11px', letterSpacing: '0.4px' }}>ORGANIZACIÓN</Text>
              <Text weight="semibold" size={300} style={{ color: '#201f1e', marginTop: '3px', display: 'block', lineHeight: '1.3' }}>
                {company}
              </Text>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: '#f9f9f9', borderRadius: '10px', border: '1px solid #edebe9' }}>
              <Text size={200} style={{ color: '#605e5c', display: 'block', fontWeight: 600, fontSize: '11px', letterSpacing: '0.4px' }}>UBICACIÓN / SEDE</Text>
              <Text weight="semibold" size={300} style={{ color: '#201f1e', marginTop: '3px', display: 'block' }}>
                {office}
              </Text>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: '#f9f9f9', borderRadius: '10px', border: '1px solid #edebe9' }}>
              <Text size={200} style={{ color: '#605e5c', display: 'block', fontWeight: 600, fontSize: '11px', letterSpacing: '0.4px' }}>CORREO INSTITUCIONAL</Text>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '3px' }}>
                <Text weight="semibold" size={300} style={{ color: '#0078d4', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {email}
                </Text>
                <Button
                  icon={<CopyRegular />}
                  appearance="subtle"
                  size="small"
                  onClick={handleCopyEmail}
                  title="Copiar correo"
                >
                  {copied ? '✓' : ''}
                </Button>
              </div>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: '#f9f9f9', borderRadius: '10px', border: '1px solid #edebe9' }}>
              <Text size={200} style={{ color: '#605e5c', display: 'block', fontWeight: 600, fontSize: '11px', letterSpacing: '0.4px' }}>ESTADO DE CUENTA M365</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '5px' }}>
                <CheckmarkCircleRegular style={{ color: '#107c10', fontSize: '16px' }} />
                <Text weight="semibold" size={300} style={{ color: '#107c10' }}>
                  Activa y Autenticada
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. BENTO GRID DE DETALLES PROFESIONALES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>

        {/* Tarjeta 1: Ficha de Identidad y Contacto */}
        <Card style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e1dfdd' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <BuildingRegular style={{ fontSize: '22px', color: '#0078d4' }} />
            <Title3>Datos Laborales y Contacto</Title3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>Cargo Oficial en CIES</Text>
              <Text weight="semibold" size={300} style={{ color: '#201f1e' }}>{jobTitle}</Text>
            </div>

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>Departamento / Área</Text>
              <Text weight="semibold" size={300} style={{ color: '#201f1e' }}>{department}</Text>
            </div>

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>Correo Electrónico</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MailRegular style={{ color: '#0078d4' }} />
                <Text weight="semibold" size={300} style={{ color: '#201f1e' }}>{email}</Text>
              </div>
            </div>

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>Cuenta de Inicio de Sesión (UPN)</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRegular style={{ color: '#8764b8' }} />
                <Text size={200} style={{ color: '#323130', fontFamily: 'Consolas, monospace' }}>{upn}</Text>
              </div>
            </div>

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>Teléfono / Móvil</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CallRegular style={{ color: '#107c10' }} />
                <Text weight="semibold" size={300} style={{ color: '#201f1e' }}>{phone}</Text>
              </div>
            </div>

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>Sede de Trabajo</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LocationRegular style={{ color: '#d83b01' }} />
                <Text weight="semibold" size={300} style={{ color: '#201f1e' }}>{office}</Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Tarjeta 2: Roles y Permisos en la Intranet */}
        <Card style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e1dfdd' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <ShieldCheckmarkRegular style={{ fontSize: '22px', color: '#107c10' }} />
            <Title3>Seguridad y Permisos</Title3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block', marginBottom: '4px' }}>
                Nivel de Acceso en la Intranet
              </Text>
              <Badge
                appearance="filled"
                color={isSuperAdmin ? 'danger' : isAdmin ? 'informative' : 'brand'}
                size="large"
                icon={isSuperAdmin || isAdmin ? <ShieldCheckmarkRegular /> : <PersonRegular />}
              >
                {isSuperAdmin ? 'Super Administrador (Control Total)' : isAdmin ? 'Administrador de Contenidos' : 'Colaborador Estándar'}
              </Badge>
            </div>

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block', marginBottom: '6px' }}>
                Grupos de SharePoint Asignados:
              </Text>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {security?.roles && security.roles.length > 0 ? (
                  security.roles.map((rol) => (
                    <Badge key={rol} appearance="tint" color="brand">
                      {rol}
                    </Badge>
                  ))
                ) : (
                  <Badge appearance="outline">Intranet_Colaboradores</Badge>
                )}
              </div>
            </div>

            <Divider />

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block', marginBottom: '8px' }}>
                Matriz de Privilegios Activos:
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#107c10' }}>
                  <CheckmarkCircleRegular />
                  <span style={{ color: '#323130' }}>Navegación completa en el Portal Principal</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#107c10' }}>
                  <CheckmarkCircleRegular />
                  <span style={{ color: '#323130' }}>Acceso a Formularios y Recursos institucionales</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isSuperAdmin ? '#107c10' : '#a19f9d' }}>
                  {isSuperAdmin ? <CheckmarkCircleRegular /> : <LockClosedRegular />}
                  <span style={{ color: isSuperAdmin ? '#323130' : '#a19f9d' }}>
                    {isSuperAdmin
                      ? 'Gestión de Grupos y Asignación de Roles por Correo'
                      : 'Administración de Roles (Exclusivo Superusuarios)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón hacia Control de Roles SOLO para Superusuarios */}
            {isSuperAdmin && (
              <div style={{ marginTop: '8px' }}>
                <Link to="/admin" style={{ textDecoration: 'none' }}>
                  <Button
                    appearance="outline"
                    icon={<ArrowRightRegular />}
                    iconPosition="after"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                  >
                    Administrar Roles y Grupos
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Tarjeta 3: Entorno y Conectividad M365 */}
        <Card style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e1dfdd' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <CloudCheckmarkRegular style={{ fontSize: '22px', color: '#0078d4' }} />
            <Title3>Sesión & Entorno Tecnológico</Title3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>API de Microsoft Graph</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <Badge color="success" appearance="filled">En línea (v3.0)</Badge>
                <Text size={200} style={{ color: '#605e5c' }}>Endpoint /me conectado</Text>
              </div>
            </div>

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>Plataforma Hospedada</Text>
              <Text weight="semibold" size={300} style={{ color: '#201f1e' }}>SharePoint Online (M365 Cloud)</Text>
            </div>

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>Tenant Corporativo</Text>
              <Text size={200} style={{ color: '#0078d4', fontFamily: 'Consolas, monospace' }}>
                ciesbo.sharepoint.com
              </Text>
            </div>

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>Sitio Actual</Text>
              <Text weight="semibold" size={300} style={{ color: '#201f1e' }}>/sites/DevIntranet</Text>
            </div>

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>ID de Usuario SharePoint</Text>
              <Text size={200} style={{ color: '#323130', fontFamily: 'Consolas, monospace' }}>
                #{security?.userId || 'N/A'}
              </Text>
            </div>

            <div>
              <Text size={200} style={{ color: '#605e5c', display: 'block' }}>Método de Autenticación</Text>
              <Badge appearance="tint" color="informative">Single Sign-On (SSO)</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* 3. AVISO INFORMATIVO DE SOLO LECTURA */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#edf5fd',
        borderRadius: '10px',
        border: '1px solid #c7e0f4',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        <LockClosedRegular style={{ fontSize: '24px', color: '#0078d4', flexShrink: 0 }} />
        <Body2 style={{ color: '#004578', margin: 0 }}>
          <strong>Ficha de Perfil Institucional:</strong> Los datos de cargo, departamento, teléfono y correo son gestionados de forma centralizada por el área de Talento Humano y TI en el Directorio Activo de Microsoft 365. Si encuentras alguna información desactualizada, solicita la actualización a la Unidad de TI de CIES.
        </Body2>
      </div>

    </div>
  );
};
