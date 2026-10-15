import * as React from 'react';
import {
  Home24Regular, FolderPeople24Regular, DataPie24Regular, PersonSupport24Regular,
  VehicleCar24Regular, Box24Regular, Toolbox24Regular, Airplane24Regular, Mail24Regular,
  DocumentSignature24Regular, DocumentCheckmark24Regular,
  Poll24Regular, Globe24Regular, HeartPulse24Regular, Stethoscope24Regular, DocumentFolder24Regular,
  Pill24Regular, Calculator24Regular, Building24Regular, Beaker24Regular, DataBarVertical24Regular,
  Cloud24Regular, Database24Regular, Organization24Regular, Chat24Regular, QrCode24Regular,
  Clock24Regular, ReceiptMoney24Regular, Call24Regular, ShieldCheckmark24Regular,
  Desktop24Regular, PeopleTeam24Regular, Emoji24Regular, Bot24Regular,
  ShieldTask24Regular, Fingerprint24Regular, PeopleCommunity24Regular, Folder24Regular
} from '@fluentui/react-icons';

/**
 * ============================================================
 *  CONFIGURACIÓN DE ACCESOS DEL HOME & POPUPS
 * ============================================================
 */

export interface ILinkItem {
  label: string;
  icon: React.ReactElement;
  url: string;
  newTab?: boolean;
  desc?: string;
  color?: string;
  bg?: string;
  active?: boolean;
  category?: string;
  badge?: string;
}

/** Íconos principales del banner de bienvenida */
export const navLinks: ILinkItem[] = [
  { label: 'Inicio', icon: <Home24Regular />, color: '#8cc63f', url: '/', active: true },
  { label: 'Compartida.CIES', icon: <FolderPeople24Regular />, color: '#4fb3d9', url: 'https://ciesbo.sharepoint.com/sites/compartidacies' },
  { label: 'Power BI', icon: <DataPie24Regular />, color: '#f2c811', url: 'https://ciesbo.sharepoint.com/sites/CUADROSDEMANDOBI?e=1%3Ac1f1aa6878804ebf8192e204ebf3dc56' },
  { label: 'Atención al cliente', icon: <PersonSupport24Regular />, color: '#ff7a59', url: 'https://ciesbo.sharepoint.com/sites/intranet/SitePages/Informativo%20Atenci%C3%B3n%20al%20Cliente.aspx' }
];

/** Formularios de solicitudes (Modal Popup) */
export const forms: ILinkItem[] = [
  {
    label: 'Solicitudes de Uber',
    desc: 'Movilidad corporativa y traslados',
    icon: <VehicleCar24Regular />,
    category: 'Logística',
    color: '#0078d4',
    url: 'https://apps.powerapps.com/play/e/default-ea44d080-3ba8-4ce2-9aa3-90315977bf06/a/38d7751f-3d05-4bad-a209-1bb5739298bc?tenantId=ea44d080-3ba8-4ce2-9aa3-90315977bf06&hint=b64b269a-630c-419b-bff8-1c8fb41218d6&source=sharebutton&sourcetime=1791812400165#'
  },
  {
    label: 'Solicitud de BBSS',
    desc: 'Bienes y servicios institucionales',
    icon: <Box24Regular />,
    category: 'Logística',
    color: '#8cc63f',
    url: 'http://solicitudbbss.cies.org.bo/'
  },
  {
    label: 'Soporte técnico CIES',
    desc: 'Tickets e incidencias de TI',
    icon: <Toolbox24Regular />,
    category: 'Sistemas TI',
    color: '#2f7a6b',
    url: 'https://ciesaccion.cies.org.bo/auth/login?returnUrl=/administracion-formularios/soporte-ti'
  },
  {
    label: 'Solicitud de viaje',
    desc: 'Viáticos y comisiones nacionales',
    icon: <Airplane24Regular />,
    category: 'Administración',
    color: '#4fb3d9',
    url: 'https://apps.powerapps.com/play/e/default-ea44d080-3ba8-4ce2-9aa3-90315977bf06/a/612e81e1-78d1-4a74-bfa9-dcf0190b277c?tenantId=ea44d080-3ba8-4ce2-9aa3-90315977bf06&sourcetime=1791897265974'
  },
  {
    label: 'Recepción correspondencia',
    desc: 'Registro de correspondencia interna',
    icon: <Mail24Regular />,
    category: 'Administración',
    color: '#f2c811',
    url: 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=gNBE6qg74kyao5AxWXe_BgbPsZmm5lZOmSOPsQHa0ZVUQ01TVTNFSE5ZWEpERVk5T05ESkg4SjVJRS4u&route=shorturl'
  },
  {
    label: 'Contrato',
    desc: 'Gestión y solicitud de nuevos contratos',
    icon: <DocumentSignature24Regular />,
    category: 'RRHH & Legal',
    color: '#ff7a59',
    url: 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=gNBE6qg74kyao5AxWXe_BjjN2Wpk1yFPoexSAGk-xm1UMjRMSFFUNEdSQ0FVMEQ5SkhTODkwT1dKRS4u&route=shorturl'
  },
  {
    label: 'Contrato visado',
    desc: 'Visación jurídica y validaciones',
    icon: <DocumentCheckmark24Regular />,
    category: 'RRHH & Legal',
    color: '#7cc4ad',
    url: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=gNBE6qg74kyao5AxWXe_BjjN2Wpk1yFPoexSAGk-xm1UMDhXSjYwQkdLU1JBWThWOE1TUlJPSTlHSS4u'
  }
];

/** Recursos de uso frecuente (Modal Popup) */
export const resources: ILinkItem[] = [
  { label: 'Sistema de encuestas', desc: 'Satisfacción y evaluación', icon: <Poll24Regular />, category: 'Gestión', url: 'https://encuesta.cies.org.bo/' },
  { label: 'CIESACCION', desc: 'Plataforma institucional', icon: <Globe24Regular />, category: 'Institucional', url: 'http://ciesaccion.cies.org.bo/' },
  { label: 'MEDICARE', desc: 'Atención clínica y pacientes', icon: <HeartPulse24Regular />, category: 'Salud / Clínico', url: 'https://medicare.cies.org.bo/' },
  { label: 'MEDIBIT Admin', desc: 'Administración médica', icon: <Stethoscope24Regular />, category: 'Salud / Clínico', url: 'https://medibit.cies.org.bo/admin/' },
  { label: 'DIM CIES', desc: 'Distribución e inventarios', icon: <DocumentFolder24Regular />, category: 'Farmacia & Facturación', url: 'http://dim.cies.org.bo/' },
  { label: 'DIM Farmacia', desc: 'Facturación farmacéutica', icon: <Pill24Regular />, category: 'Farmacia & Facturación', url: 'https://dim.farmacia.facturacion.cies.org.bo/' },
  { label: 'DIM Liquidación', desc: 'Liquidaciones clínicas', icon: <Calculator24Regular />, category: 'Farmacia & Facturación', url: 'https://dim.liquidacion.cies.org.bo/' },
  { label: 'DIM TES', desc: 'Tesorería y balances', icon: <Building24Regular />, category: 'Farmacia & Facturación', url: 'http://bdim.cies.org.bo/' },
  { label: 'Test CIESACCION', desc: 'Entorno de pruebas', icon: <Beaker24Regular />, category: 'Ambientes Test', url: 'http://test.ciesaccion.cies.org.bo/' },
  { label: 'Test MEDICARE', desc: 'Pruebas clínicas', icon: <Beaker24Regular />, category: 'Ambientes Test', url: 'https://test.medicare.cies.org.bo/' },
  { label: 'Test MEDIBIT Admin', desc: 'Pruebas administrativas', icon: <Beaker24Regular />, category: 'Ambientes Test', url: 'https://test.medibit.cies.org.bo/admin/' },
  { label: 'METABASE', desc: 'Visualización de datos SQL', icon: <DataBarVertical24Regular />, category: 'Analítica & BI', url: 'http://metabase.cies.org.bo:3000/' },
  { label: 'Power BI', desc: 'Cuadros de mando institucionales', icon: <DataPie24Regular />, category: 'Analítica & BI', url: 'https://ciesbo.sharepoint.com/sites/CUADROSDEMANDOBI?e=1%3ac1f1aa6878804ebf8192e204ebf3dc56' },
  { label: 'Microsoft Azure', desc: 'Portal cloud de servicios TI', icon: <Cloud24Regular />, category: 'Sistemas & TI', url: 'https://portal.azure.com/' },
  { label: 'SALAR Software', desc: 'Planillas y talento humano', icon: <Database24Regular />, category: 'RRHH & Planillas', url: 'https://cies.salar11.net/ingresar.aspx' },
  { label: 'SGP_App', desc: 'Gestión por procesos PowerApps', icon: <Organization24Regular />, category: 'Sistemas & TI', url: 'https://apps.powerapps.com/play/e/default-ea44d080-3ba8-4ce2-9aa3-90315977bf06/a/037b88e4-99ec-4a07-bf51-af896f3b27a6?tenantId=ea44d080-3ba8-4ce2-9aa3-90315977bf06&sourcetime=1736872077390' },
  { label: 'WABO WhatsApp', desc: 'Mensajería institucional', icon: <Chat24Regular />, category: 'Comunicación', url: 'https://wabo.app/' },
  { label: 'BISA QR', desc: 'Pagos con QR Bancario', icon: <QrCode24Regular />, category: 'Finanzas', url: 'https://sip.mc4.com.bo/login' },
  { label: 'BioTime 8.0', desc: 'Control de asistencia', icon: <Clock24Regular />, category: 'RRHH & Planillas', url: 'http://sap.admin.cies.org.bo:8081/' },
  { label: 'AXS facturación', desc: 'Servicios de conectividad', icon: <ReceiptMoney24Regular />, category: 'Sistemas & TI', url: 'https://misservicios.axsbolivia.com:61443/#/login' },
  { label: 'PBX ON', desc: 'Telefonía IP CIES', icon: <Call24Regular />, category: 'Comunicación', url: 'https://192.168.0.150:8022/' },
  { label: 'Sophos Central', desc: 'Seguridad y antivirus endpoint', icon: <ShieldCheckmark24Regular />, category: 'Sistemas & TI', url: 'https://central.sophos.com/manage/login' },
  { label: 'Soporte TI', desc: 'Mesa de ayuda directa', icon: <PersonSupport24Regular />, category: 'Sistemas & TI', url: 'http://soporteti.cies.org.bo/' }
];

/** Franja "Accesos a sistemas" */
export const systems: ILinkItem[] = [
  { label: 'MEDICARE', desc: 'Gestión clínica & pacientes', icon: <HeartPulse24Regular />, color: '#2f9e44', url: 'https://medicare.cies.org.bo/' },
  { label: 'COMPARTIDA.CIES', desc: 'Documentos compartidos', icon: <Folder24Regular />, color: '#0078d4', url: 'https://ciesbo.sharepoint.com/sites/compartidacies' },
  { label: 'SALAR RRHH', desc: 'Talento humano & planillas', icon: <PeopleCommunity24Regular />, color: '#1c3f94', url: 'https://cies.salar11.net/ingresar.aspx' },
  { label: 'SGD', desc: 'Gestión documental institucional', icon: <DocumentFolder24Regular />, color: '#8cc63f', url: 'http://sgd.cies.org.bo/' },
  { label: 'BIOFILE', desc: 'Control biométrico nacional', icon: <Fingerprint24Regular />, color: '#1fa2d6', url: 'https://ong.biofile.com.co/' },
  { label: 'SEGURO ESTAR BIEN', desc: 'Alianza seguros de salud', icon: <ShieldTask24Regular />, color: '#004a98', url: 'https://www.alianza.com.bo/SingleUserR2/Home' }
];

/** Nuevas páginas */
export const newPages: ILinkItem[] = [
  { label: 'Proyecto Salud Mental CIES', desc: 'Bienestar emocional para nuestro equipo', icon: <Emoji24Regular />, bg: 'linear-gradient(135deg,#6a4c93,#ff6f91)', url: '' },
  { label: 'Agentes AI CIES Copilot', desc: 'Inteligencia artificial al servicio del trabajo', icon: <Bot24Regular />, bg: 'linear-gradient(135deg,#0f2a3a,#4fb3d9)', url: '' }
];

/** Descargas */
export const downloads: ILinkItem[] = [
  { label: 'AnyDesk', desc: 'Soporte remoto para soporte TI', icon: <Desktop24Regular />, color: '#ef443b', url: 'https://anydesk.com/es/downloads/thank-you?dv=win_exe' },
  { label: 'Microsoft Teams', desc: 'Chat y reuniones de equipo', icon: <PeopleTeam24Regular />, color: '#5b5fc7', url: 'https://www.microsoft.com/es-es/microsoft-teams/download-app' }
];
