import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@fluentui/react-components';
import { HomeRegular, ShieldKeyholeRegular } from '@fluentui/react-icons';

interface ISidebarProps {
  roles: string[];
}

export const Sidebar: React.FC<ISidebarProps> = ({ roles }) => {
  // Ajusta 'Intranet_Admin' o el nombre del grupo de SharePoint que uses para admin
  const isAdmin = roles.includes('Intranet_Admin') || roles.some(r => r.toLowerCase().includes('admin'));

  return (
    <aside style={{
      width: '240px',
      borderRight: '1px solid #edebe9',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      backgroundColor: '#faf9f8'
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Button icon={<HomeRegular />} appearance="subtle" style={{ width: '100%', justifyContent: 'flex-start' }}>
          Inicio
        </Button>
      </Link>
      {isAdmin && (
        <Link to="/admin" style={{ textDecoration: 'none' }}>
          <Button icon={<ShieldKeyholeRegular />} appearance="subtle" style={{ width: '100%', justifyContent: 'flex-start' }}>
            Administración
          </Button>
        </Link>
      )}
    </aside>
  );
};