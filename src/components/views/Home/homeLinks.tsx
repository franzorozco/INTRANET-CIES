import * as React from 'react';
import {
  Home24Regular, DocumentBulletList24Regular, FolderPeople24Regular, DataPie24Regular, PersonSupport24Regular,
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
 *  CONFIGURACIÓN DE ACCESOS DEL HOME
 * ============================================================
 *  Solo completa la propiedad `url` de cada elemento:
 *
 *   - Enlace externo  -> 'https://medicare.cies.org'   (se abre en nueva pestaña)
 *   - Ruta interna    -> '/admin'                      (navega dentro de la intranet)
 *   - Ancla en página -> '#formularios'                (hace scroll a la sección)
 *   - Vacío ''        -> se muestra como "Próximamente" y no navega
 *
 *  Opcional: `newTab: false` para abrir un enlace externo en la misma pestaña.
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
}

/** Íconos principales del banner de bienvenida */
export const navLinks: ILinkItem[] = [
  { label: 'Inicio', icon: <Home24Regular />, color: '#8cc63f', url: '/', active: true },
  { label: 'Formularios', icon: <DocumentBulletList24Regular />, color: '#7cc4ad', url: '#formularios' },
  { label: 'Compartida.CIES', icon: <FolderPeople24Regular />, color: '#4fb3d9', url: '' },
  { label: 'Power BI', icon: <DataPie24Regular />, color: '#f2c811', url: '' },
  { label: 'Atención al cliente', icon: <PersonSupport24Regular />, color: '#ff7a59', url: '' }
];

/** Formularios de solicitudes */
export const forms: ILinkItem[] = [
  { label: 'Solicitudes de Uber', icon: <VehicleCar24Regular />, url: 'https://apps.powerapps.com/play/e/default-ea44d080-3ba8-4ce2-9aa3-90315977bf06/a/38d7751f-3d05-4bad-a209-1bb5739298bc?tenantId=ea44d080-3ba8-4ce2-9aa3-90315977bf06&hint=b64b269a-630c-419b-bff8-1c8fb41218d6&source=sharebutton&sourcetime=1791812400165#' },
  { label: 'Solicitud de BBSS', icon: <Box24Regular />, url: 'http://solicitudbbss.cies.org.bo/' },
  { label: 'Soporte técnico CIES', icon: <Toolbox24Regular />, url: 'https://ciesaccion.cies.org.bo/auth/login?returnUrl=/administracion-formularios/soporte-ti' },
  { label: 'Solicitud de viaje', icon: <Airplane24Regular />, url: 'https://apps.powerapps.com/play/e/default-ea44d080-3ba8-4ce2-9aa3-90315977bf06/a/612e81e1-78d1-4a74-bfa9-dcf0190b277c?tenantId=ea44d080-3ba8-4ce2-9aa3-90315977bf06&sourcetime=1791897265974' },
  { label: 'Recepción correspondencia', icon: <Mail24Regular />, url: 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=gNBE6qg74kyao5AxWXe_BgbPsZmm5lZOmSOPsQHa0ZVUQ01TVTNFSE5ZWEpERVk5T05ESkg4SjVJRS4u&route=shorturl' },
  { label: 'Contrato', icon: <DocumentSignature24Regular />, url: 'https://forms.cloud.microsoft/pages/responsepage.aspx?id=gNBE6qg74kyao5AxWXe_BjjN2Wpk1yFPoexSAGk-xm1UMjRMSFFUNEdSQ0FVMEQ5SkhTODkwT1dKRS4u&route=shorturl' },
  { label: 'Contrato visado', icon: <DocumentCheckmark24Regular />, url: 'https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=gNBE6qg74kyao5AxWXe_BjjN2Wpk1yFPoexSAGk-xm1UMDhXSjYwQkdLU1JBWThWOE1TUlJPSTlHSS4u' }
];

/** Recursos de uso frecuente */
export const resources: ILinkItem[] = [
  { label: 'Sistema de encuestas', icon: <Poll24Regular />, url: 'https://encuesta.cies.org.bo/' },
  { label: 'CIESACCION', icon: <Globe24Regular />, url: 'http://ciesaccion.cies.org.bo/' },
  { label: 'MEDICARE', icon: <HeartPulse24Regular />, url: 'https://medicare.cies.org.bo/' },
  { label: 'MEDIBIT Admin', icon: <Stethoscope24Regular />, url: 'https://medibit.cies.org.bo/admin/' },
  { label: 'DIM CIES', icon: <DocumentFolder24Regular />, url: 'http://dim.cies.org.bo/' },
  { label: 'DIM Farmacia', icon: <Pill24Regular />, url: 'https://dim.farmacia.facturacion.cies.org.bo/' },
  { label: 'DIM Liquidación', icon: <Calculator24Regular />, url: 'https://dim.liquidacion.cies.org.bo/' },
  { label: 'DIM TES', icon: <Building24Regular />, url: 'http://bdim.cies.org.bo/' },
  { label: 'Test CIESACCION', icon: <Beaker24Regular />, url: 'http://test.ciesaccion.cies.org.bo/' },
  { label: 'Test MEDICARE', icon: <Beaker24Regular />, url: 'https://test.medicare.cies.org.bo/' },
  { label: 'Test MEDIBIT Admin', icon: <Beaker24Regular />, url: 'https://test.medibit.cies.org.bo/admin/' },
  { label: 'METABASE', icon: <DataBarVertical24Regular />, url: 'http://metabase.cies.org.bo:3000/' },
  { label: 'Power BI', icon: <DataPie24Regular />, url: 'https://ciesbo.sharepoint.com/sites/CUADROSDEMANDOBI?e=1%3ac1f1aa6878804ebf8192e204ebf3dc56' },
  { label: 'Microsoft Azure', icon: <Cloud24Regular />, url: 'https://portal.azure.com/' },
  { label: 'SALAR Software', icon: <Database24Regular />, url: 'https://cies.salar11.net/ingresar.aspx' },
  { label: 'SGP_App', icon: <Organization24Regular />, url: 'https://apps.powerapps.com/play/e/default-ea44d080-3ba8-4ce2-9aa3-90315977bf06/a/037b88e4-99ec-4a07-bf51-af896f3b27a6?tenantId=ea44d080-3ba8-4ce2-9aa3-90315977bf06&sourcetime=1736872077390' },
  { label: 'WABO envío WhatsApp', icon: <Chat24Regular />, url: 'https://wabo.app/' },
  { label: 'BISA QR', icon: <QrCode24Regular />, url: 'https://sip.mc4.com.bo/login' },
  { label: 'BioTime 8.0', icon: <Clock24Regular />, url: 'http://sap.admin.cies.org.bo:8081/' },
  { label: 'AXS facturación', icon: <ReceiptMoney24Regular />, url: 'https://misservicios.axsbolivia.com:61443/#/login' },
  { label: 'PBX ON', icon: <Call24Regular />, url: 'https://192.168.0.150:8022/' },
  { label: 'Sophos Central', icon: <ShieldCheckmark24Regular />, url: 'https://central.sophos.com/manage/login' },
  { label: 'Soporte TI', icon: <PersonSupport24Regular />, url: 'http://soporteti.cies.org.bo/' }
];

/** Franja "Accesos a sistemas" */
export const systems: ILinkItem[] = [
  { label: 'MEDICARE', desc: 'Gestión clínica', icon: <HeartPulse24Regular />, color: '#2f9e44', url: '' },
  { label: 'COMPARTIDA.CIES', desc: 'Documentos compartidos', icon: <Folder24Regular />, color: '#0078d4', url: '' },
  { label: 'SALAR RRHH', desc: 'Talento humano', icon: <PeopleCommunity24Regular />, color: '#1c3f94', url: '' },
  { label: 'SGD', desc: 'Gestión documental', icon: <DocumentFolder24Regular />, color: '#8cc63f', url: '' },
  { label: 'BIOFILE', desc: 'Control biométrico', icon: <Fingerprint24Regular />, color: '#1fa2d6', url: '' },
  { label: 'SEGURO ESTAR BIEN', desc: 'Alianza seguros', icon: <ShieldTask24Regular />, color: '#004a98', url: '' }
];

/** Nuevas páginas */
export const newPages: ILinkItem[] = [
  { label: 'Proyecto Salud Mental CIES', desc: 'Bienestar emocional para nuestro equipo', icon: <Emoji24Regular />, bg: 'linear-gradient(135deg,#6a4c93,#ff6f91)', url: '' },
  { label: 'Agentes AI CIES Copilot', desc: 'Inteligencia artificial al servicio del trabajo', icon: <Bot24Regular />, bg: 'linear-gradient(135deg,#0f2a3a,#4fb3d9)', url: '' }
];

/** Descargas */
export const downloads: ILinkItem[] = [
  { label: 'AnyDesk', desc: 'Soporte remoto', icon: <Desktop24Regular />, color: '#ef443b', url: '' },
  { label: 'Microsoft Teams', desc: 'Chat y reuniones', icon: <PeopleTeam24Regular />, color: '#5b5fc7', url: '' }
];
