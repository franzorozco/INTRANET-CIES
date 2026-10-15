import * as React from 'react';
import { MessageBar, MessageBarTitle, MessageBarBody } from '@fluentui/react-components';

interface IProtectedRouteProps {
  userRoles: string[];
  isSuperAdmin?: boolean;
  requiredRole?: string | string[];
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  userRoles,
  isSuperAdmin = false,
  requiredRole,
  children
}) => {
  // 1. Super Administradores tienen acceso irrestricto a todos los módulos
  if (isSuperAdmin) {
    return children;
  }

  // 2. Comprobar si se cumple el rol requerido
  if (requiredRole) {
    const rolesToCheck = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasPermission = rolesToCheck.some(role => userRoles.indexOf(role) !== -1);

    if (!hasPermission) {
      return (
        <div style={{ padding: '24px' }}>
          <MessageBar intent="error">
            <MessageBarTitle>Acceso Restringido</MessageBarTitle>
            <MessageBarBody>
              Tu cuenta no pertenece al grupo requerido (<strong>{rolesToCheck.join(' o ')}</strong>) para ver esta sección. Si requieres acceso, contacta a un administrador de la Intranet.
            </MessageBarBody>
          </MessageBar>
        </div>
      );
    }
  }

  return children;
};