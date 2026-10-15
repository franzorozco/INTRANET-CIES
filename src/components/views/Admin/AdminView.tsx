import * as React from 'react';
import {
  Title2,
  Title3,
  Body1,
  Card,
  Button,
  Input,
  Select,
  Badge,
  Spinner,
  MessageBar,
  MessageBarTitle,
  MessageBarBody
} from '@fluentui/react-components';
import {
  PeopleAddRegular,
  ShieldCheckmarkRegular,
  DeleteRegular,
  ArrowSyncRegular,
  CheckmarkCircleRegular
} from '@fluentui/react-icons';
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
    loadMembers(activeGroup);
  }, [activeGroup, loadMembers]);

  // Manejar creación automática de grupos
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
        text: `El usuario "${user.Title || emailInput}" fue asignado exitosamente al rol [${selectedRole}].`
      });
      setEmailInput('');

      // Si el rol asignado es el que estamos viendo actualmente, recargar lista
      if (selectedRole === activeGroup) {
        await loadMembers(activeGroup);
      }
    } catch (err: any) {
      console.error('Error al asignar usuario:', err);
      setAssignMessage({
        type: 'error',
        text: `No se pudo asignar el rol: ${err?.message || 'Verifica que el correo sea válido en el directorio de Microsoft 365.'}`
      });
    } finally {
      setAssignLoading(false);
    }
  };

  // Manejar eliminación de usuario del grupo
  const handleRemoveUser = async (userId: number, userName: string) => {
    if (!window.confirm(`¿Estás seguro de remover a "${userName}" del grupo [${activeGroup}]?`)) {
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

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <Title2>Seguridad y Control de Roles</Title2>
        <Body1 style={{ color: '#605e5c', display: 'block', marginTop: '4px' }}>
          Administra los grupos de SharePoint, asigna roles por correo electrónico y gestiona permisos de la Intranet CIES.
        </Body1>
      </div>

      {/* Tarjeta 1: Inicialización de Grupos en SharePoint */}
      <Card style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title3>1. Grupos de SharePoint de la Intranet</Title3>
            <Body1 style={{ color: '#605e5c', display: 'block', marginTop: '4px' }}>
              Verifica y crea automáticamente los grupos de seguridad oficiales en este sitio de SharePoint.
            </Body1>
          </div>
          <Button
            appearance="primary"
            icon={<ShieldCheckmarkRegular />}
            onClick={handleEnsureGroups}
            disabled={initLoading}
          >
            {initLoading ? <Spinner size="tiny" /> : 'Inicializar Grupos'}
          </Button>
        </div>

        {initResult && (
          <div style={{ marginTop: '16px' }}>
            <MessageBar intent="success">
              <MessageBarTitle>Verificación de Grupos Completa</MessageBarTitle>
              <MessageBarBody>
                {initResult.created.length > 0 && (
                  <div>Grupos creados ahora: <strong>{initResult.created.join(', ')}</strong>.</div>
                )}
                <div>Grupos existentes activos: <strong>{initResult.existing.join(', ')}</strong>.</div>
              </MessageBarBody>
            </MessageBar>
          </div>
        )}
      </Card>

      {/* Tarjeta 2: Formulario de Asignación de Rol por Correo */}
      <Card style={{ padding: '20px' }}>
        <Title3>2. Asignar Rol por Correo Electrónico</Title3>
        <Body1 style={{ color: '#605e5c', display: 'block', marginTop: '4px', marginBottom: '16px' }}>
          Ingresa el correo institucional del colaborador y selecciona el rol a conceder (Super Admin, Administrador, etc.).
        </Body1>

        {assignMessage && (
          <div style={{ marginBottom: '16px' }}>
            <MessageBar intent={assignMessage.type}>
              <MessageBarTitle>{assignMessage.type === 'success' ? 'Éxito' : 'Error'}</MessageBarTitle>
              <MessageBarBody>{assignMessage.text}</MessageBarBody>
            </MessageBar>
          </div>
        )}

        <form onSubmit={handleAssignRole} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Input
            type="email"
            placeholder="correo@cies.org.bo"
            value={emailInput}
            onChange={(_, data) => setEmailInput(data.value)}
            style={{ minWidth: '280px', flex: 1 }}
            required
          />

          <Select
            value={selectedRole}
            onChange={(_, data) => setSelectedRole(data.value)}
            style={{ minWidth: '220px' }}
          >
            {INTRANET_GROUPS.map((g) => (
              <option key={g.title} value={g.title}>
                {g.title === INTRANET_SUPERADMIN_ROLE
                  ? 'Super Admin (Control Total)'
                  : g.title === INTRANET_ADMIN_ROLE
                  ? 'Administrador Intranet'
                  : g.title}
              </option>
            ))}
          </Select>

          <Button
            type="submit"
            appearance="primary"
            icon={<PeopleAddRegular />}
            disabled={assignLoading || !emailInput.trim()}
          >
            {assignLoading ? <Spinner size="tiny" /> : 'Asignar Rol'}
          </Button>
        </form>
      </Card>

      {/* Tarjeta 3: Explorador de Miembros por Grupo */}
      <Card style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Title3>3. Miembros Activos por Rol</Title3>
            <Body1 style={{ color: '#605e5c' }}>
              Revisa qué usuarios pertenecen a cada grupo y revoca accesos cuando sea necesario.
            </Body1>
          </div>
          <Button
            icon={<ArrowSyncRegular />}
            appearance="subtle"
            onClick={() => loadMembers(activeGroup)}
            disabled={membersLoading}
          >
            Actualizar
          </Button>
        </div>

        {/* Pestañas de Roles */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {INTRANET_GROUPS.map((group) => {
            const isSelected = activeGroup === group.title;
            return (
              <Button
                key={group.title}
                appearance={isSelected ? 'primary' : 'outline'}
                onClick={() => setActiveGroup(group.title)}
                size="small"
              >
                {group.title}
              </Button>
            );
          })}
        </div>

        {/* Tabla de usuarios del grupo seleccionado */}
        {membersLoading ? (
          <div style={{ padding: '30px', display: 'flex', justifyContent: 'center' }}>
            <Spinner label={`Cargando miembros de ${activeGroup}...`} />
          </div>
        ) : members.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
            <Body1 style={{ color: '#605e5c' }}>
              Actualmente no hay usuarios registrados en el grupo <strong>{activeGroup}</strong>.
            </Body1>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {members.map((user) => (
              <div
                key={user.Id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #edebe9',
                  borderRadius: '6px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#323130' }}>{user.Title}</div>
                  <div style={{ fontSize: '12px', color: '#605e5c' }}>{user.Email || user.LoginName}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Badge appearance="tint" color="brand">
                    <CheckmarkCircleRegular style={{ marginRight: '4px' }} /> Miembro
                  </Badge>
                  <Button
                    icon={<DeleteRegular style={{ color: '#a80000' }} />}
                    appearance="subtle"
                    size="small"
                    onClick={() => handleRemoveUser(user.Id, user.Title)}
                    disabled={removeLoadingId === user.Id}
                  >
                    {removeLoadingId === user.Id ? <Spinner size="tiny" /> : 'Remover'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};