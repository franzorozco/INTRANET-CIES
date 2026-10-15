import * as React from 'react';
import {
  Title1,
  Title2,
  Title3,
  Body1,
  Body2,
  Card,
  Button,
  Input,
  Select,
  Badge,
  Spinner,
  MessageBar,
  MessageBarTitle,
  MessageBarBody,
  Avatar,
  Divider,
  Text
} from '@fluentui/react-components';
import {
  ShieldCheckmarkRegular,
  ShieldKeyholeRegular,
  PersonAddRegular,
  DeleteRegular,
  ArrowSyncRegular,
  CheckmarkCircleRegular,
  ArrowLeftRegular,
  LockClosedRegular,
  InfoRegular,
  PeopleRegular,
  MailRegular
} from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import {
  INTRANET_GROUPS,
  INTRANET_SUPERADMIN_ROLE,
  INTRANET_ADMIN_ROLE
} from '../../../constants/roles';
import {
  ensureIntranetGroups,
  getGroupMembers,
  addUserToGroup,
  removeUserFromGroup
} from '../../../services/spService';
import type { ISiteUserInfo } from '@pnp/sp/site-users/types';

export const AdminView: React.FC = () => {
  // Estados para inicialización de grupos
  const [initLoading, setInitLoading] = React.useState<boolean>(false);
  const [initResult, setInitResult] = React.useState<{ created: string[]; existing: string[] } | null>(null);

  // Estados para asignación por correo
  const [emailInput, setEmailInput] = React.useState<string>('');
  const [selectedRole, setSelectedRole] = React.useState<string>(INTRANET_ADMIN_ROLE);
  const [assignLoading, setAssignLoading] = React.useState<boolean>(false);
  const [assignMessage, setAssignMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados para listar miembros de grupos
  const [activeGroup, setActiveGroup] = React.useState<string>(INTRANET_ADMIN_ROLE);
  const [members, setMembers] = React.useState<ISiteUserInfo[]>([]);
  const [membersLoading, setMembersLoading] = React.useState<boolean>(false);
  const [removeLoadingId, setRemoveLoadingId] = React.useState<number | null>(null);

  // Cargar miembros del grupo seleccionado
  const loadMembers = React.useCallback(async (groupName: string) => {
    setMembersLoading(true);
    try {
      const users = await getGroupMembers(groupName);
      setMembers(users);
    } catch (err) {
      console.error('Error al cargar miembros:', err);
      setMembers([]);
    } finally {
      setMembersLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadMembers(activeGroup);
  }, [activeGroup, loadMembers]);

  // Manejar creación / verificación automática de grupos
  const handleEnsureGroups = async () => {
    setInitLoading(true);
    setInitResult(null);
    try {
      const result = await ensureIntranetGroups();
      setInitResult(result);
      await loadMembers(activeGroup);
    } catch (err: any) {
      console.error('Error al inicializar grupos:', err);
    } finally {
      setInitLoading(false);
    }
  };

  // Manejar asignación de rol por correo
  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setAssignLoading(true);
    setAssignMessage(null);

    try {
      const user = await addUserToGroup(selectedRole, emailInput.trim());
      setAssignMessage({
        type: 'success',
        text: `El colaborador "${user.Title || emailInput}" fue asignado exitosamente al rol [${selectedRole}].`
      });
      setEmailInput('');

      // Si el rol asignado es el que estamos viendo actualmente, recargar lista
      if (selectedRole === activeGroup) {
        await loadMembers(activeGroup);
      }
    } catch (err: any) {
      console.error('Error al asignar usuario:', err);
      let errorText = 'Ocurrió un error al asignar el rol. Verifica la conexión con SharePoint.';
      const rawMsg = err?.message || '';

      if (rawMsg.indexOf('No se encontró el usuario') !== -1 || rawMsg.indexOf('400') !== -1) {
        errorText = `El correo "${emailInput}" no pertenece a la organización CIES en Microsoft 365. Asegúrate de ingresar un correo institucional registrado (ej: @cies.org.bo o @ciesbo.onmicrosoft.com).`;
      } else if (rawMsg) {
        errorText = rawMsg;
      }

      setAssignMessage({
        type: 'error',
        text: errorText
      });
    } finally {
      setAssignLoading(false);
    }
  };

  // Manejar eliminación de usuario del grupo
  const handleRemoveUser = async (userId: number, userName: string) => {
    if (!window.confirm(`¿Estás seguro de remover los permisos de "${userName}" en el rol [${activeGroup}]?`)) {
      return;
    }

    setRemoveLoadingId(userId);
    try {
      await removeUserFromGroup(activeGroup, userId);
      await loadMembers(activeGroup);
    } catch (err) {
      console.error('Error al remover usuario:', err);
      alert('Ocurrió un error al intentar remover al usuario.');
    } finally {
      setRemoveLoadingId(null);
    }
  };

  // Obtener descripción del grupo activo
  const activeGroupInfo = INTRANET_GROUPS.find((g) => g.title === activeGroup);

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1150px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* 1. PORTADA HERO EJECUTIVA - CONSOLA DE SEGURIDAD */}
      <Card style={{
        padding: '0',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid #e1dfdd',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
        backgroundColor: '#ffffff'
      }}>
        {/* Banner con gradiente de seguridad CIES */}
        <div style={{
          background: 'linear-gradient(135deg, #102a36 0%, #173f4d 50%, #1e5a52 100%)',
          padding: '20px 28px',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <Link to="/perfil" style={{ textDecoration: 'none' }}>
              <Button
                appearance="subtle"
                icon={<ArrowLeftRegular />}
                size="small"
                style={{
                  color: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                Volver a Mi Perfil
              </Button>
            </Link>

            <Badge
              appearance="tint"
              color="informative"
              icon={<LockClosedRegular />}
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)', color: '#ffffff', border: 'none' }}
            >
              Consola Restringida: Exclusivo Super Administradores
            </Badge>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '14px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldKeyholeRegular style={{ fontSize: '34px', color: '#8cc63f' }} />
            </div>

            <div>
              <Title1 style={{ color: '#ffffff', margin: 0, fontWeight: 700, fontSize: '26px' }}>
                Seguridad y Control de Roles
              </Title1>
              <Text size={300} style={{ color: '#c7e0f4', display: 'block', marginTop: '4px', lineHeight: '1.4' }}>
                Gobierno de accesos institucionales, gestión de grupos en SharePoint y asignación de privilegios para la Intranet CIES.
              </Text>
            </div>
          </div>
        </div>

        {/* Cinta de estado del sistema (Quick Facts) */}
        <div style={{
          padding: '16px 28px',
          backgroundColor: '#fcfcfc',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          borderTop: '1px solid #edebe9'
        }}>
          <div>
            <Text size={200} style={{ color: '#605e5c', display: 'block', fontWeight: 600, fontSize: '11px', letterSpacing: '0.4px' }}>
              GRUPOS OFICIALES
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <CheckmarkCircleRegular style={{ color: '#107c10', fontSize: '16px' }} />
              <Text weight="semibold" size={300} style={{ color: '#201f1e' }}>
                5 Grupos Configurados
              </Text>
            </div>
          </div>

          <div>
            <Text size={200} style={{ color: '#605e5c', display: 'block', fontWeight: 600, fontSize: '11px', letterSpacing: '0.4px' }}>
              DIRECTORIO DE IDENTIDADES
            </Text>
            <Text weight="semibold" size={300} style={{ color: '#201f1e', marginTop: '4px', display: 'block' }}>
              Microsoft 365 (Entra ID)
            </Text>
          </div>

          <div>
            <Text size={200} style={{ color: '#605e5c', display: 'block', fontWeight: 600, fontSize: '11px', letterSpacing: '0.4px' }}>
              NIVEL DE PRIVILEGIO ACTUAL
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Badge appearance="filled" color="danger" size="small">
                Super Administrador
              </Badge>
            </div>
          </div>

          <div>
            <Text size={200} style={{ color: '#605e5c', display: 'block', fontWeight: 600, fontSize: '11px', letterSpacing: '0.4px' }}>
              ESTADO DE CONEXIÓN
            </Text>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Badge appearance="tint" color="success" size="small">
                En Línea (SharePoint REST)
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* 2. TARJETA: FORMULARIO DE ASIGNACIÓN DE ROL */}
      <Card style={{
        padding: '24px 28px',
        borderRadius: '12px',
        border: '1px solid #e1dfdd',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <PersonAddRegular style={{ fontSize: '22px', color: '#0078d4' }} />
          <Title3 style={{ margin: 0, fontWeight: 700, color: '#201f1e' }}>
            Asignar Rol a un Colaborador
          </Title3>
        </div>
        <Body1 style={{ color: '#605e5c', display: 'block', marginBottom: '18px' }}>
          Ingresa el correo institucional del colaborador y selecciona el grupo de seguridad correspondiente para concederle acceso en la Intranet.
        </Body1>

        {assignMessage && (
          <div style={{ marginBottom: '18px' }}>
            <MessageBar intent={assignMessage.type}>
              <MessageBarTitle>{assignMessage.type === 'success' ? 'Operación Exitosa' : 'Aviso de Asignación'}</MessageBarTitle>
              <MessageBarBody>{assignMessage.text}</MessageBarBody>
            </MessageBar>
          </div>
        )}

        <form onSubmit={handleAssignRole} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 320px', minWidth: '280px' }}>
            <Input
              type="email"
              contentBefore={<MailRegular style={{ color: '#605e5c' }} />}
              placeholder="correo@cies.org.bo o @ciesbo.onmicrosoft.com"
              value={emailInput}
              onChange={(_, data) => setEmailInput(data.value)}
              style={{ width: '100%' }}
              size="medium"
              required
            />
          </div>

          <div style={{ flex: '1 1 260px', minWidth: '240px' }}>
            <Select
              value={selectedRole}
              onChange={(_, data) => setSelectedRole(data.value)}
              style={{ width: '100%' }}
              size="medium"
            >
              {INTRANET_GROUPS.map((g) => (
                <option key={g.title} value={g.title}>
                  {g.title === INTRANET_SUPERADMIN_ROLE
                    ? 'Super Admin (Control Total)'
                    : g.title === INTRANET_ADMIN_ROLE
                    ? 'Administrador Intranet (Contenidos)'
                    : g.title === 'Intranet_RRHH'
                    ? 'Recursos Humanos (Talento CIES)'
                    : g.title === 'Intranet_Finanzas'
                    ? 'Finanzas y Contratos'
                    : 'Colaborador General'}
                </option>
              ))}
            </Select>
          </div>

          <Button
            type="submit"
            appearance="primary"
            icon={<PersonAddRegular />}
            size="medium"
            disabled={assignLoading || !emailInput.trim()}
            style={{ fontWeight: 600 }}
          >
            {assignLoading ? <Spinner size="tiny" /> : 'Asignar Rol'}
          </Button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
          padding: '10px 14px',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          border: '1px solid #edebe9'
        }}>
          <InfoRegular style={{ color: '#0078d4', fontSize: '18px', flexShrink: 0 }} />
          <Text size={200} style={{ color: '#605e5c' }}>
            Solo se pueden asignar colaboradores con cuenta institucional activa en el tenant de Microsoft 365 de CIES.
          </Text>
        </div>
      </Card>

      {/* 3. TARJETA: EXPLORADOR Y GESTIÓN DE MIEMBROS POR ROL */}
      <Card style={{
        padding: '24px 28px',
        borderRadius: '12px',
        border: '1px solid #e1dfdd',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PeopleRegular style={{ fontSize: '22px', color: '#107c10' }} />
              <Title3 style={{ margin: 0, fontWeight: 700, color: '#201f1e' }}>
                Miembros Activos por Rol
              </Title3>
            </div>
            <Body1 style={{ color: '#605e5c', display: 'block', marginTop: '4px' }}>
              Revisa los usuarios asignados a cada grupo de seguridad y gestiona o revoca sus privilegios en tiempo real.
            </Body1>
          </div>

          <Button
            icon={<ArrowSyncRegular />}
            appearance="outline"
            size="small"
            onClick={() => loadMembers(activeGroup)}
            disabled={membersLoading}
          >
            Actualizar Lista
          </Button>
        </div>

        {/* Pestañas de Selección de Grupos */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {INTRANET_GROUPS.map((group) => {
            const isSelected = activeGroup === group.title;
            return (
              <Button
                key={group.title}
                appearance={isSelected ? 'primary' : 'outline'}
                onClick={() => setActiveGroup(group.title)}
                size="medium"
                style={{
                  fontWeight: isSelected ? 600 : 400,
                  borderRadius: '20px',
                  padding: '6px 16px'
                }}
              >
                {group.title}
              </Button>
            );
          })}
        </div>

        {/* Banner descriptivo del grupo seleccionado */}
        {activeGroupInfo && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#edf5fd',
            borderRadius: '8px',
            border: '1px solid #c7e0f4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheckmarkRegular style={{ color: '#0078d4', fontSize: '18px' }} />
              <Text size={300} style={{ color: '#004578', fontWeight: 600 }}>
                {activeGroupInfo.title}:
              </Text>
              <Text size={300} style={{ color: '#004578' }}>
                {activeGroupInfo.description}
              </Text>
            </div>
            <Badge appearance="filled" color="brand">
              {membersLoading ? 'Cargando...' : `${members.length} Miembro${members.length === 1 ? '' : 's'}`}
            </Badge>
          </div>
        )}

        {/* Listado de Miembros */}
        {membersLoading ? (
          <div style={{ padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <Spinner size="medium" />
            <Text size={300} style={{ color: '#605e5c' }}>
              Consultando miembros de {activeGroup} en SharePoint...
            </Text>
          </div>
        ) : members.length === 0 ? (
          <div style={{
            padding: '36px 20px',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            border: '1px dashed #d1d5db'
          }}>
            <PeopleRegular style={{ fontSize: '36px', color: '#9ca3af', marginBottom: '8px' }} />
            <Text weight="semibold" size={400} style={{ color: '#374151', display: 'block' }}>
              No hay usuarios asignados a este rol todavía
            </Text>
            <Text size={200} style={{ color: '#6b7280', display: 'block', marginTop: '4px' }}>
              Usa el formulario superior para asignar el primer colaborador ingresando su correo institucional.
            </Text>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {members.map((user) => (
              <div
                key={user.Id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 18px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #edebe9',
                  borderRadius: '10px',
                  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.15s ease-in-out'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Avatar
                    name={user.Title || 'U'}
                    size={40}
                    color="brand"
                  />
                  <div>
                    <Text weight="semibold" size={300} style={{ color: '#201f1e', display: 'block' }}>
                      {user.Title}
                    </Text>
                    <Text size={200} style={{ color: '#605e5c', display: 'block', marginTop: '2px' }}>
                      {user.Email || user.LoginName}
                    </Text>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Badge appearance="tint" color="brand">
                    <CheckmarkCircleRegular style={{ marginRight: '4px' }} /> Miembro Activo
                  </Badge>

                  <Button
                    icon={<DeleteRegular style={{ color: '#a80000' }} />}
                    appearance="subtle"
                    size="small"
                    style={{ color: '#a80000', fontWeight: 600 }}
                    onClick={() => handleRemoveUser(user.Id, user.Title)}
                    disabled={removeLoadingId === user.Id}
                  >
                    {removeLoadingId === user.Id ? <Spinner size="tiny" /> : 'Remover Acceso'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 4. TARJETA: INFRAESTRUCTURA DE GRUPOS Y DIAGNÓSTICO */}
      <Card style={{
        padding: '20px 24px',
        borderRadius: '12px',
        border: '1px solid #edebe9',
        backgroundColor: '#fafafa'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheckmarkRegular style={{ color: '#107c10', fontSize: '20px' }} />
              <Text weight="semibold" size={300} style={{ color: '#201f1e' }}>
                Infraestructura de Grupos de SharePoint
              </Text>
              <Badge appearance="tint" color="success">Operativo</Badge>
            </div>
            <Text size={200} style={{ color: '#605e5c', display: 'block', marginTop: '4px' }}>
              Los 5 grupos de la Intranet ya están creados en este sitio. Solo necesitas verificar si agregaste un nuevo rol al código.
            </Text>
          </div>

          <Button
            appearance="outline"
            size="small"
            icon={<ArrowSyncRegular />}
            onClick={handleEnsureGroups}
            disabled={initLoading}
          >
            {initLoading ? <Spinner size="tiny" /> : 'Verificar / Comprobar Grupos'}
          </Button>
        </div>

        {initResult && (
          <div style={{ marginTop: '14px' }}>
            <MessageBar intent="success">
              <MessageBarTitle>Verificación de Grupos Completa</MessageBarTitle>
              <MessageBarBody>
                {initResult.created.length > 0 && (
                  <div>Nuevos grupos creados: <strong>{initResult.created.join(', ')}</strong>.</div>
                )}
                <div>Grupos confirmados y activos: <strong>{initResult.existing.join(', ')}</strong>.</div>
              </MessageBarBody>
            </MessageBar>
          </div>
        )}
      </Card>

    </div>
  );
};