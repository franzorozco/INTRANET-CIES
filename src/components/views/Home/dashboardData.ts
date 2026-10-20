export interface IKpiStat {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  change: string;
  isPositive: boolean;
  period: string;
  subtitle: string;
  iconName: string;
  color: string;
  trend: number[];
}

export interface IMonthlyData {
  month: string;
  atenciones: number;
  solicitudes: number;
  satisfaccion: number;
}

export interface ICategoryDistribution {
  category: string;
  percentage: number;
  count: number;
  color: string;
}

export interface IRegionalStat {
  regional: string;
  completado: number; // Porcentaje 0-100
  atenciones: number;
  meta: number;
  estado: 'Optimo' | 'En Meta' | 'Atención';
}

export interface IRecentActivity {
  id: string;
  title: string;
  category: string;
  time: string;
  status: 'Completado' | 'En Proceso' | 'Pendiente' | 'Informativo';
  author: string;
  badgeColor: string;
}

export interface ISystemStatus {
  name: string;
  role: string;
  uptime: string;
  status: 'online' | 'degraded' | 'maintenance';
  url: string;
  color: string;
}

/**
 * Datos estadísticos e indicadores de gestión para el Dashboard CIES
 */
export const dashboardKpis: IKpiStat[] = [
  {
    id: 'kpi-atenciones',
    title: 'Consultas Médicas CIES',
    value: '24,850',
    numericValue: 24850,
    change: '+12.4%',
    isPositive: true,
    period: 'vs mes anterior',
    subtitle: 'Atenciones a nivel nacional',
    iconName: 'HeartPulse',
    color: '#2f7a6b',
    trend: [18, 20, 22, 21, 24, 25, 27, 29]
  },
  {
    id: 'kpi-solicitudes',
    title: 'Trámites & Solicitudes',
    value: '1,420',
    numericValue: 1420,
    change: '+8.1%',
    isPositive: true,
    period: '98.5% resueltas en SLA',
    subtitle: 'BBSS, Uber, TI y Contratos',
    iconName: 'DocumentBulletList',
    color: '#8cc63f',
    trend: [10, 14, 13, 17, 19, 18, 22, 24]
  },
  {
    id: 'kpi-satisfaccion',
    title: 'Índice de Satisfacción',
    value: '97.2%',
    numericValue: 97.2,
    change: '+2.3%',
    isPositive: true,
    period: 'Calificación 4.9/5',
    subtitle: 'Encuestas de calidad de servicio',
    iconName: 'Poll',
    color: '#ff9800',
    trend: [92, 93, 94, 95, 94, 96, 96, 97]
  },
  {
    id: 'kpi-sistemas',
    title: 'Disponibilidad de Sistemas',
    value: '99.9%',
    numericValue: 99.9,
    change: 'Estable',
    isPositive: true,
    period: '24 plataformas activas',
    subtitle: 'Infraestructura Cloud & Local',
    iconName: 'Cloud',
    color: '#0078d4',
    trend: [99, 99, 100, 99, 100, 100, 99, 100]
  }
];

export const monthlyTrends: IMonthlyData[] = [
  { month: 'Ene', atenciones: 2150, solicitudes: 110, satisfaccion: 94 },
  { month: 'Feb', atenciones: 2340, solicitudes: 125, satisfaccion: 95 },
  { month: 'Mar', atenciones: 2510, solicitudes: 145, satisfaccion: 95 },
  { month: 'Abr', atenciones: 2420, solicitudes: 130, satisfaccion: 96 },
  { month: 'May', atenciones: 2680, solicitudes: 160, satisfaccion: 96 },
  { month: 'Jun', atenciones: 2790, solicitudes: 175, satisfaccion: 97 },
  { month: 'Jul', atenciones: 2850, solicitudes: 180, satisfaccion: 97 },
  { month: 'Ago', atenciones: 2920, solicitudes: 195, satisfaccion: 98 },
  { month: 'Sep', atenciones: 3100, solicitudes: 210, satisfaccion: 97 },
  { month: 'Oct', atenciones: 3290, solicitudes: 225, satisfaccion: 98 }
];

export const requestDistribution: ICategoryDistribution[] = [
  { category: 'Talento Humano & Bienestar', percentage: 34, count: 482, color: '#8cc63f' },
  { category: 'Soporte TI & Sistemas', percentage: 28, count: 398, color: '#2f7a6b' },
  { category: 'Movilidad & Logística (BBSS/Uber)', percentage: 22, count: 312, color: '#0078d4' },
  { category: 'Contratos, Legal & Visados', percentage: 16, count: 228, color: '#ff7a59' }
];

export const regionalStats: IRegionalStat[] = [
  { regional: 'La Paz - El Alto', completado: 96, atenciones: 7850, meta: 8000, estado: 'Optimo' },
  { regional: 'Santa Cruz', completado: 92, atenciones: 6920, meta: 7500, estado: 'Optimo' },
  { regional: 'Cochabamba', completado: 89, atenciones: 5140, meta: 5800, estado: 'En Meta' },
  { regional: 'Chuquisaca (Sucre)', completado: 95, atenciones: 3410, meta: 3600, estado: 'Optimo' },
  { regional: 'Tarija', completado: 87, atenciones: 2630, meta: 3000, estado: 'En Meta' },
  { regional: 'Potosí & Oruro', completado: 84, atenciones: 2150, meta: 2500, estado: 'En Meta' }
];

export const recentActivities: IRecentActivity[] = [
  {
    id: 'act-1',
    title: 'Solicitud de Movilidad Uber aprobada para comisión médica',
    category: 'Movilidad',
    time: 'Hace 15 min',
    status: 'Completado',
    author: 'Dra. Mariana Flores · Regional La Paz',
    badgeColor: '#8cc63f'
  },
  {
    id: 'act-2',
    title: 'Actualización y mantenimiento preventivo en MEDICARE completado',
    category: 'Sistemas TI',
    time: 'Hace 1 hora',
    status: 'Completado',
    author: 'Equipo de Infraestructura TI',
    badgeColor: '#0078d4'
  },
  {
    id: 'act-3',
    title: 'Nuevo lote de visados y contratos laborales generado',
    category: 'Legal / RRHH',
    time: 'Hace 3 horas',
    status: 'En Proceso',
    author: 'Lic. Roberto Vargas · RRHH',
    badgeColor: '#ff9800'
  },
  {
    id: 'act-4',
    title: 'Recepción y validación de correspondencia institucional',
    category: 'Administración',
    time: 'Hace 5 horas',
    status: 'Completado',
    author: 'Mesa de Entrada CIES',
    badgeColor: '#2f7a6b'
  },
  {
    id: 'act-5',
    title: 'Encuesta de Satisfacción y Clima Organizacional disponible',
    category: 'Encuestas',
    time: 'Hoy, 08:30',
    status: 'Informativo',
    author: 'Dirección de Desarrollo Organizacional',
    badgeColor: '#9c27b0'
  }
];

export const systemsStatusList: ISystemStatus[] = [
  { name: 'MEDICARE', role: 'Gestión Clínica & Historias', uptime: '99.9%', status: 'online', url: 'https://medicare.cies.org.bo/', color: '#2f9e44' },
  { name: 'COMPARTIDA.CIES', role: 'Repositorio Documental SharePoint', uptime: '100%', status: 'online', url: 'https://ciesbo.sharepoint.com/sites/compartidacies', color: '#0078d4' },
  { name: 'SALAR RRHH', role: 'Planillas & Talento Humano', uptime: '99.8%', status: 'online', url: 'https://cies.salar11.net/ingresar.aspx', color: '#1c3f94' },
  // { name: 'SGD', role: 'Sistema Gestión Documental', uptime: '99.7%', status: 'online', url: 'http://sgd.cies.org.bo/', color: '#8cc63f' },
  // { name: 'BIOFILE', role: 'Control Asistencia Biométrico', uptime: '99.9%', status: 'online', url: 'https://ong.biofile.com.co/', color: '#1fa2d6' },
  { name: 'SEGURO ESTAR BIEN', role: 'Plataforma Alianza Seguros', uptime: '100%', status: 'online', url: 'https://www.alianza.com.bo/SingleUserR2/Home', color: '#004a98' }
];
