import { WebPartContext } from '@microsoft/sp-webpart-base';
import { MSGraphClientV3 } from '@microsoft/sp-http-msgraph';

export type EventSource = 'personal' | 'institutional';

export interface ICalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  location?: string;
  source: EventSource; // 'personal' (Outlook M365) o 'institutional' (CIES)
  category?: 'Salud' | 'Capacitación' | 'Reunión' | 'Institucional' | 'Campaña' | 'Feriado' | 'Personal';
  color: string;
  organizer?: string;
  webLink?: string;
  isTeamsMeeting?: boolean;
  myParticipationRole?: 'Organizador' | 'Participante Confirmado' | 'Invitado' | 'Ponente / Facilitador';
  highlightBadge?: string;
}

/**
 * Eventos institucionales generales de CIES (Campañas de salud, feriados, jornadas y talleres abiertos a toda la institución)
 */
export const MOCK_INSTITUTIONAL_EVENTS: ICalendarEvent[] = [
  {
    id: 'inst-1',
    title: 'Campaña Nacional de Prevención y Salud Sexual',
    description: 'Jornada integral en policlínicos CIES a nivel nacional con consultas y tamizajes gratuitos para la comunidad.',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 12, 8, 30),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 12, 16, 30),
    allDay: false,
    location: 'Todas las Regionales CIES',
    source: 'institutional',
    category: 'Campaña',
    color: '#8cc63f',
    organizer: 'Dirección Médica CIES',
    highlightBadge: 'Campaña Masiva'
  },
  {
    id: 'inst-2',
    title: 'Taller de Actualización en Protocolos Clínicos 2026',
    description: 'Capacitación virtual para personal médico y enfermería sobre guías clínicas actualizadas de salud sexual y reproductiva.',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 14, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 16, 0),
    allDay: false,
    location: 'Microsoft Teams CIES',
    source: 'institutional',
    category: 'Capacitación',
    color: '#0078d4',
    organizer: 'Unidad de Docencia e Investigación',
    isTeamsMeeting: true,
    webLink: 'https://teams.microsoft.com',
    highlightBadge: 'Virtual Teams'
  },
  {
    id: 'inst-3',
    title: 'Reunión de Coordinación Nacional de Operaciones CIES',
    description: 'Evaluación mensual de metas de atenciones en salud, abastecimiento y proyectos de cooperación internacional.',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 24, 9, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 24, 11, 30),
    allDay: false,
    location: 'Sala de Directorio - Oficina Nacional & Híbrido Teams',
    source: 'institutional',
    category: 'Institucional',
    color: '#2f7a6b',
    organizer: 'Dirección Ejecutiva CIES',
    isTeamsMeeting: true,
    highlightBadge: 'Nivel Ejecutivo'
  },
  {
    id: 'inst-4',
    title: 'Feria Comunitaria de Salud Integral CIES con Jóvenes',
    description: 'Atención móvil, asesorías gratuitas en derechos sexuales y reproductivos con líderes juveniles comunitarios.',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 28, 9, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 28, 14, 0),
    allDay: false,
    location: 'Plaza San Francisco / Regional La Paz',
    source: 'institutional',
    category: 'Salud',
    color: '#ff7a59',
    organizer: 'Coordinación Regional La Paz',
    highlightBadge: 'Comunitario'
  },
  {
    id: 'inst-5',
    title: 'Conferencia: Avances en Salud Reproductiva y Telemedicina',
    description: 'Simposio anual con especialistas invitados para el fortalecimiento del servicio de telemedicina CIES.',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 10, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 5, 12, 30),
    allDay: false,
    location: 'Auditorio CIES & Transmisión Teams',
    source: 'institutional',
    category: 'Capacitación',
    color: '#7cc4ad',
    organizer: 'Dirección de Salud y Programas',
    isTeamsMeeting: true,
    highlightBadge: 'Abierto a Colaboradores'
  },
  {
    id: 'inst-6',
    title: 'Feriado Nacional / Asueto Institucional CIES',
    description: 'Conmemoración oficial según calendario laboral boliviano e institucional de CIES.',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 23, 59),
    allDay: true,
    location: 'Todas las Sedes y Clínicas',
    source: 'institutional',
    category: 'Feriado',
    color: '#d13438',
    organizer: 'Talento Humano CIES',
    highlightBadge: 'Feriado Oficial'
  }
];

/**
 * Eventos personales demostrativos en los que el usuario PARTICIPA (Outlook M365 + Asignaciones)
 */
export const MOCK_PERSONAL_EVENTS: ICalendarEvent[] = [
  {
    id: 'pers-1',
    title: 'Revisión Técnica y Presentación de Avances Intranet CIES',
    description: 'Sesión ejecutiva de demostración de módulos, seguridad y roles ante jefatura de sistemas y coordinación.',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 10, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 11, 0),
    allDay: false,
    location: 'Oficina de Sistemas / Reunión Teams',
    source: 'personal',
    category: 'Reunión',
    color: '#0078d4',
    organizer: 'Pasantía Sistemas',
    isTeamsMeeting: true,
    myParticipationRole: 'Ponente / Facilitador',
    webLink: 'https://teams.microsoft.com',
    highlightBadge: 'Hoy'
  },
  {
    id: 'pers-2',
    title: 'Mesa de Trabajo: Soporte e Incidencias en Clínicas Regionales',
    description: 'Atención a incidencias en sistemas clínicos MEDICARE y requerimientos de usuarios de la regional.',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 15, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 2, 16, 30),
    allDay: false,
    location: 'Mesa de Ayuda CIES TI',
    source: 'personal',
    category: 'Personal',
    color: '#004e8c',
    organizer: 'Jefatura de Sistemas',
    myParticipationRole: 'Participante Confirmado'
  },
  {
    id: 'pers-3',
    title: 'Taller Especializado: Seguridad y Cumplimiento Microsoft 365',
    description: 'Capacitación técnica en gobierno de SharePoint Online, permisos y Graph API asignada a mi persona.',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5, 9, 30),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 5, 11, 0),
    allDay: false,
    location: 'Microsoft Teams Cloud',
    source: 'personal',
    category: 'Capacitación',
    color: '#5c2d91',
    organizer: 'Unidad de TI y Ciberseguridad',
    isTeamsMeeting: true,
    myParticipationRole: 'Participante Confirmado',
    webLink: 'https://teams.microsoft.com'
  },
  {
    id: 'pers-4',
    title: 'Evaluación Trimestral de Objetivos y Plan de Trabajo',
    description: 'Reunión 1 a 1 de seguimiento con jefatura directa sobre metas alcanzadas y nuevas iniciativas.',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 8, 14, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 8, 15, 0),
    allDay: false,
    location: 'Oficina Central CIES - Sala B',
    source: 'personal',
    category: 'Reunión',
    color: '#2f7a6b',
    organizer: 'Recursos Humanos / Jefatura',
    myParticipationRole: 'Invitado'
  }
];

/**
 * Obtiene eventos personales del calendario del usuario en Microsoft 365 vía Microsoft Graph (/me/events o /me/calendarView).
 */
export const getMyCalendarEvents = async (context?: WebPartContext): Promise<ICalendarEvent[]> => {
  if (!context) {
    return MOCK_PERSONAL_EVENTS;
  }

  try {
    const client: MSGraphClientV3 = await context.msGraphClientFactory.getClient('3');
    
    // Rango del mes actual (+/- 15 días)
    const now = new Date();
    const startRange = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endRange = new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();

    const response = await client
      .api('/me/calendarView')
      .query({
        startDateTime: startRange,
        endDateTime: endRange,
        $top: 30,
        $select: 'id,subject,bodyPreview,start,end,isAllDay,location,isOnlineMeeting,onlineMeeting,webLink,organizer,responseStatus'
      })
      .get();

    if (response && response.value && response.value.length > 0) {
      return response.value.map((ev: any): ICalendarEvent => {
        let myRole: ICalendarEvent['myParticipationRole'] = 'Participante Confirmado';
        if (ev.responseStatus?.response === 'organizer') {
          myRole = 'Organizador';
        } else if (ev.responseStatus?.response === 'accepted') {
          myRole = 'Participante Confirmado';
        } else {
          myRole = 'Invitado';
        }

        return {
          id: ev.id,
          title: ev.subject || 'Reunión agendada',
          description: ev.bodyPreview || '',
          start: new Date(ev.start?.dateTime ? ev.start.dateTime + 'Z' : Date.now()),
          end: new Date(ev.end?.dateTime ? ev.end.dateTime + 'Z' : Date.now()),
          allDay: Boolean(ev.isAllDay),
          location: ev.location?.displayName || (ev.isOnlineMeeting ? 'Reunión Teams' : 'Oficina CIES'),
          source: 'personal',
          category: 'Personal',
          color: '#0078d4',
          organizer: ev.organizer?.emailAddress?.name || 'Mi Calendario',
          webLink: ev.webLink || ev.onlineMeeting?.joinUrl,
          isTeamsMeeting: Boolean(ev.isOnlineMeeting),
          myParticipationRole: myRole
        };
      });
    }

    return MOCK_PERSONAL_EVENTS;
  } catch (err) {
    console.info('Usando eventos personales enriquecidos para Microsoft 365:', err);
    return MOCK_PERSONAL_EVENTS;
  }
};

/**
 * Obtiene eventos institucionales generales de CIES
 */
export const getInstitutionalEvents = async (_context?: WebPartContext): Promise<ICalendarEvent[]> => {
  return MOCK_INSTITUTIONAL_EVENTS;
};
