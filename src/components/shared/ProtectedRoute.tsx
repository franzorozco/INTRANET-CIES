import * as React from 'react';
import { MessageBar, MessageBarTitle, MessageBarBody } from '@fluentui/react-components';

interface IProtectedRouteProps {
  userRoles: string[];
  requiredRole?: string;
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<IProtectedRouteProps> = ({
  userRoles,
  requiredRole,
  children
}) => {
  if (requiredRole && userRoles.indexOf(requiredRole) === -1) {
    return (
      <div style={{ padding: '24px' }}>
        <MessageBar intent="error">
          <MessageBarTitle>Acceso Restringido</MessageBarTitle>
          <MessageBarBody>
            Tu cuenta no pertenece al grupo requerido (<strong>{requiredRole}</strong>) para ver esta sección.
          </MessageBarBody>
        </MessageBar>
      </div>
    );
  }

  return children;
};