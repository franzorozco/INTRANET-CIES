import * as React from 'react';
import {
  Clock16Regular,
  Location16Regular,
  Video16Regular,
  Open16Regular,
  CheckmarkCircle16Regular,
  PersonRegular,
  CalendarLtr24Regular,
  Dismiss20Regular
} from '@fluentui/react-icons';
import {
  ICalendarEvent,
  getMyCalendarEvents
} from '../../services/calendarService';
import type { WebPartContext } from '@microsoft/sp-webpart-base';

interface IMyEventsViewerProps {
  context?: WebPartContext;
}

export const MyEventsViewer: React.FC<IMyEventsViewerProps> = ({ context }) => {
  const [events, setEvents] = React.useState<ICalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = React.useState<ICalendarEvent | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    void getMyCalendarEvents(context)
      .then(data => {
        if (isMounted) setEvents(data);
      })
      .catch(err => {
        console.warn('Error al cargar mis eventos personales:', err);
      });
    return () => { isMounted = false; };
  }, [context]);

  const getRoleBadgeStyle = (role?: string): { bg: string; color: string; border: string } => {
    switch (role) {
      case 'Organizador':
        return { bg: '#eff6fc', color: '#0078d4', border: '#c7e0f4' };
      case 'Ponente / Facilitador':
        return { bg: '#f3f9eb', color: '#2f7a6b', border: '#d5e8c8' };
      case 'Participante Confirmado':
        return { bg: '#e6f4ea', color: '#137333', border: '#ceead6' };
      default:
        return { bg: '#fef7e0', color: '#b06000', border: '#feefc3' };
    }
  };

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e1dfdd',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 1. HEADER DE MIS EVENTOS & PARTICIPACIONES */}
      <div style={{
        padding: '18px 24px',
        borderBottom: '1px solid #edebe9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'linear-gradient(135deg, #0078d4 0%, #106ebe 50%, #004e8c 100%)',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px'
          }}>
            <CalendarLtr24Regular />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>
              Mis Eventos y Participaciones Activas
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#deecf9' }}>
              Reuniones de Outlook M365, capacitaciones asignadas y citas donde participo
            </p>
          </div>
        </div>

        <span style={{
          fontSize: '12px',
          padding: '4px 12px',
          borderRadius: '14px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          fontWeight: 600
        }}>
          {events.length} Eventos Agendados
        </span>
      </div>

      {/* 2. LISTA DETALLADA DE EVENTOS PERSONALES CON PARTICIPACIÓN */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#605e5c' }}>
            No tienes eventos personales o reuniones agendadas en este período.
          </div>
        ) : (
          events.map(ev => {
            const roleStyle = getRoleBadgeStyle(ev.myParticipationRole);
            const dateStr = ev.start.toLocaleDateString('es-BO', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            });
            const timeStr = ev.allDay
              ? 'Todo el día'
              : `${ev.start.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })} - ${ev.end.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}`;

            return (
              <div
                key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #edebe9',
                  borderLeft: '4px solid #0078d4',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#faf9f8';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Fecha badge */}
                  <div style={{
                    backgroundColor: '#eff6fc',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    textAlign: 'center',
                    minWidth: '65px'
                  }}>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#605e5c', display: 'block', fontWeight: 600 }}>
                      {dateStr.split(' ')[0]}
                    </span>
                    <strong style={{ fontSize: '16px', color: '#0078d4' }}>
                      {dateStr.split(' ')[1]} {dateStr.split(' ')[2]}
                    </strong>
                  </div>

                  {/* Contenido del Evento */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '14px', color: '#201f1e' }}>{ev.title}</strong>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        backgroundColor: roleStyle.bg,
                        color: roleStyle.color,
                        border: `1px solid ${roleStyle.border}`,
                        fontWeight: 600
                      }}>
                        {ev.myParticipationRole || 'Participante'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '12px', color: '#605e5c' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock16Regular /> {timeStr}
                      </span>
                      {ev.location && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Location16Regular /> {ev.location}
                        </span>
                      )}
                      {ev.isTeamsMeeting && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#5b5fc7', fontWeight: 600 }}>
                          <Video16Regular /> Teams
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {ev.isTeamsMeeting && (
                    <a
                      href={ev.webLink || 'https://teams.microsoft.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#5b5fc7',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Video16Regular /> Unirme
                    </a>
                  )}
                  <span style={{ color: '#0078d4', fontSize: '12px', fontWeight: 600 }}>
                    Detalles →
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. MODAL DETALLE DE MI EVENTO */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setSelectedEvent(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#0078d4',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PersonRegular />
                <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>
                  Mi Participación en Evento
                </span>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Dismiss20Regular />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#201f1e' }}>
                  {selectedEvent.title}
                </h3>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: '#eff6fc',
                  color: '#0078d4'
                }}>
                  Rol: {selectedEvent.myParticipationRole || 'Participante'}
                </span>
              </div>

              {selectedEvent.description && (
                <p style={{ margin: 0, fontSize: '13px', color: '#605e5c', lineHeight: 1.5 }}>
                  {selectedEvent.description}
                </p>
              )}

              <div style={{
                backgroundColor: '#faf9f8',
                padding: '14px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '13px',
                color: '#323130'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock16Regular style={{ color: '#0078d4' }} />
                  <span>
                    <strong>Horario: </strong>
                    {selectedEvent.allDay
                      ? 'Todo el día'
                      : `${selectedEvent.start.toLocaleDateString('es-BO')} • ${selectedEvent.start.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })} a ${selectedEvent.end.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}`}
                  </span>
                </div>

                {selectedEvent.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Location16Regular style={{ color: '#8cc63f' }} />
                    <span>
                      <strong>Lugar: </strong>
                      {selectedEvent.location}
                    </span>
                  </div>
                )}

                {selectedEvent.organizer && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckmarkCircle16Regular style={{ color: '#107c10' }} />
                    <span>
                      <strong>Organizado por: </strong>
                      {selectedEvent.organizer}
                    </span>
                  </div>
                )}
              </div>

              {selectedEvent.webLink && (
                <a
                  href={selectedEvent.webLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#0078d4',
                    color: '#ffffff',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  <Open16Regular /> Abrir en Microsoft 365 / Outlook
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
