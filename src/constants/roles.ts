// Roles del sistema Intranet CIES
export const INTRANET_SUPERADMIN_ROLE = 'Intranet_SuperAdmin';
export const INTRANET_ADMIN_ROLE = 'Intranet_Admin';
export const INTRANET_RRHH_ROLE = 'Intranet_RRHH';
export const INTRANET_FINANZAS_ROLE = 'Intranet_Finanzas';
export const INTRANET_COLABORADOR_ROLE = 'Intranet_Colaboradores';

// Lista de grupos requeridos en SharePoint
export const INTRANET_GROUPS = [
  {
    title: INTRANET_SUPERADMIN_ROLE,
    description: 'Super Administradores de la Intranet CIES. Control total de roles y configuración.'
  },
  {
    title: INTRANET_ADMIN_ROLE,
    description: 'Administradores de la Intranet CIES. Gestión de contenidos y solicitudes.'
  },
  {
    title: INTRANET_RRHH_ROLE,
    description: 'Gestores de Recursos Humanos y Talento Humano CIES.'
  },
  {
    title: INTRANET_FINANZAS_ROLE,
    description: 'Gestores de Finanzas, Contratos y Liquidaciones CIES.'
  },
  {
    title: INTRANET_COLABORADOR_ROLE,
    description: 'Colaboradores generales con acceso a la Intranet CIES.'
  }
];

// Correos que tienen rango de Super Administrador automáticamente
// Puedes agregar aquí los correos de los líderes técnicos / administradores principales
export const SUPER_ADMIN_EMAILS: string[] = [
  'forozco@cies.org.bo',
  'franzorozco@ciesbo.onmicrosoft.com',
  'admin@ciesbo.onmicrosoft.com'
];
