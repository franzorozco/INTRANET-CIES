import * as React from 'react';
import {
  CalendarMonth24Regular,
  CalendarLtr24Regular,
  PersonRegular,
  BuildingRegular,
  ChevronLeft20Regular,
  ChevronRight20Regular,
  Location16Regular,
  Clock16Regular,
  Dismiss20Regular,
  Open16Regular,
  Filter20Regular,
  Add20Regular,
  Video16Regular,
  CheckmarkCircle16Regular
} from '@fluentui/react-icons';
import {
  ICalendarEvent,
  EventSource,
  getMyCalendarEvents,
  getInstitutionalEvents
} from '../../services/calendarService';
import type { WebPartContext } from '@microsoft/sp-webpart-base';

interface ICalendarEventsWidgetProps {
  context?: WebPartContext;
  compact?: boolean;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const CalendarEventsWidget: React.FC<ICalendarEventsWidgetProps> = ({ context, compact = false }) => {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
  const [events, setEvents] = React.useState<ICalendarEvent[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Filtros de sobreposición (Overlaid calendars)
  const [showPersonal, setShowPersonal] = React.useState<boolean>(true);
  const [showInstitutional, setShowInstitutional] = React.useState<boolean>(true);

  // Vista activa: 'mes' | 'agenda'
  const [viewMode, setViewMode] = React.useState<'mes' | 'agenda'>('mes');

  // Modal / detalle del evento seleccionado
  const [selectedEvent, setSelectedEvent] = React.useState<ICalendarEvent | null>(null);

  // Cargar eventos (M365 Personal + Institucional CIES)
  React.useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([
      getMyCalendarEvents(context),
      getInstitutionalEvents(context)
    ]).then(([persEvents, instEvents]) => {
      if (isMounted) {
        setEvents([...persEvents, ...instEvents]);
        setLoading(false);
      }
    }).catch(err => {
      console.warn('Error al cargar calendarios:', err);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [context]);

  // Navegación de mes
  const handlePrevMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = (): void => {
    setCurrentDate(new Date());
  };

  // Eventos filtrados por las capas activas
  const filteredEvents = events.filter(ev => {
    if (ev.source === 'personal' && !showPersonal) return false;
    if (ev.source === 'institutional' && !showInstitutional) return false;
    return true;
  });

  // Cálculo de la cuadrícula mensual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Construir matriz de días
  const calendarDays: Array<{
    dayNumber: number;
    isCurrentMonth: boolean;
    date: Date;
    isToday: boolean;
    events: ICalendarEvent[];
  }> = [];

  const today = new Date();

  // Días previos
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const date = new Date(year, month - 1, d);
    calendarDays.push({
      dayNumber: d,
      isCurrentMonth: false,
      date,
      isToday: false,
      events: []
    });
  }

  // Días del mes actual
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isToday =
      today.getDate() === d &&
      today.getMonth() === month &&
      today.getFullYear() === year;

    const dayEvents = filteredEvents.filter(ev => {
      const evDate = new Date(ev.start);
      return (
        evDate.getDate() === d &&
        evDate.getMonth() === month &&
        evDate.getFullYear() === year
      );
    });

    calendarDays.push({
      dayNumber: d,
      isCurrentMonth: true,
      date,
      isToday,
      events: dayEvents
    });
  }

  // Completar hasta múltiplos de 7
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const date = new Date(year, month + 1, d);
    calendarDays.push({
      dayNumber: d,
      isCurrentMonth: false,
      date,
      isToday: false,
      events: []
    });
  }

  // Eventos para la vista Agenda (ordenados por fecha)
  const agendaEvents = [...filteredEvents].sort((a, b) => a.start.getTime() - b.start.getTime());

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
      {/* 1. BARRA SUPERIOR DE CONTROL Y SOBREPOSICIÓN DE CAPAS */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #edebe9',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        background: 'linear-gradient(180deg, #faf9f8 0%, #ffffff 100%)'
      }}>
        {/* Título y Navegación de Fecha */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#0f2a3a',
            color: '#8cc63f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CalendarMonth24Regular />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#1b2630' }}>
              {MONTH_NAMES[month]} {year}
            </h3>
            <span style={{ fontSize: '12px', color: '#605e5c' }}>
              Calendario Unificado • Personal (Outlook M365) + Institucional CIES
            </span>
          </div>
        </div>

        {/* Controles de Vista y Mes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Botones de Navegación */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e1dfdd', borderRadius: '8px', overflow: 'hidden' }}>
            <button
              onClick={handlePrevMonth}
              title="Mes Anterior"
              style={{
                background: '#ffffff',
                border: 'none',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#323130'
              }}
            >
              <ChevronLeft20Regular />
            </button>
            <button
              onClick={handleToday}
              style={{
                background: '#ffffff',
                border: 'none',
                borderLeft: '1px solid #edebe9',
                borderRight: '1px solid #edebe9',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                color: '#0078d4'
              }}
            >
              Hoy
            </button>
            <button
              onClick={handleNextMonth}
              title="Mes Siguiente"
              style={{
                background: '#ffffff',
                border: 'none',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#323130'
              }}
            >
              <ChevronRight20Regular />
            </button>
          </div>

          {/* Selector de Vista: Mes / Agenda */}
          <div style={{ display: 'flex', backgroundColor: '#f3f2f1', padding: '3px', borderRadius: '8px' }}>
            <button
              onClick={() => setViewMode('mes')}
              style={{
                border: 'none',
                backgroundColor: viewMode === 'mes' ? '#ffffff' : 'transparent',
                color: viewMode === 'mes' ? '#0f2a3a' : '#605e5c',
                fontWeight: viewMode === 'mes' ? 600 : 400,
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: viewMode === 'mes' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              style={{
                border: 'none',
                backgroundColor: viewMode === 'agenda' ? '#ffffff' : 'transparent',
                color: viewMode === 'agenda' ? '#0f2a3a' : '#605e5c',
                fontWeight: viewMode === 'agenda' ? 600 : 400,
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: viewMode === 'agenda' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Agenda
            </button>
          </div>
        </div>
      </div>

      {/* 2. BARRA DE CAPAS SOBREPUESTAS (FILTROS CONMUTABLES) */}
      <div style={{
        padding: '8px 20px',
        backgroundColor: '#faf9f8',
        borderBottom: '1px solid #edebe9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#605e5c' }}>
          <Filter20Regular style={{ fontSize: '15px' }} />
          <span style={{ fontWeight: 600 }}>Capas del Calendario:</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Capa 1: Personal M365 */}
          <button
            onClick={() => setShowPersonal(!showPersonal)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              border: showPersonal ? '1.5px solid #0078d4' : '1px solid #d1d1d1',
              backgroundColor: showPersonal ? '#eff6fc' : '#f3f2f1',
              color: showPersonal ? '#004578' : '#8a8886',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#0078d4'
            }} />
            <PersonRegular style={{ fontSize: '14px' }} />
            Personal (Outlook M365)
          </button>

          {/* Capa 2: Institucional CIES */}
          <button
            onClick={() => setShowInstitutional(!showInstitutional)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              border: showInstitutional ? '1.5px solid #8cc63f' : '1px solid #d1d1d1',
              backgroundColor: showInstitutional ? '#f3f9eb' : '#f3f2f1',
              color: showInstitutional ? '#2f7a6b' : '#8a8886',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#8cc63f'
            }} />
            <BuildingRegular style={{ fontSize: '14px' }} />
            Institucional CIES (Salud / Campañas)
          </button>
        </div>
      </div>

      {/* 3. CONTENIDO: VISTA MENSUAL O AGENDA */}
      {viewMode === 'mes' ? (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          {/* Encabezados de días de la semana */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #edebe9',
            textAlign: 'center',
            fontSize: '12px',
            fontWeight: 700,
            color: '#605e5c'
          }}>
            {DAY_NAMES.map(day => (
              <div key={day} style={{ padding: '10px 4px' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Grilla de Días del Mes */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(110px, 1fr))',
            gridAutoRows: compact ? '95px' : '115px'
          }}>
            {calendarDays.map((cell, idx) => (
              <div
                key={idx}
                style={{
                  borderRight: (idx + 1) % 7 === 0 ? 'none' : '1px solid #edebe9',
                  borderBottom: '1px solid #edebe9',
                  padding: '6px',
                  backgroundColor: !cell.isCurrentMonth
                    ? '#faf9f8'
                    : cell.isToday
                    ? '#f0f9ff'
                    : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  overflow: 'hidden'
                }}
              >
                {/* Número del día */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: cell.isToday ? 700 : 500,
                    color: !cell.isCurrentMonth
                      ? '#c8c6c4'
                      : cell.isToday
                      ? '#ffffff'
                      : '#323130',
                    backgroundColor: cell.isToday ? '#0078d4' : 'transparent',
                    width: cell.isToday ? '22px' : 'auto',
                    height: cell.isToday ? '22px' : 'auto',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {cell.dayNumber}
                  </span>

                  {cell.events.length > 0 && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      color: '#605e5c',
                      backgroundColor: '#edebe9',
                      padding: '1px 5px',
                      borderRadius: '8px'
                    }}>
                      {cell.events.length}
                    </span>
                  )}
                </div>

                {/* Lista de Eventos del Día */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', overflowY: 'auto' }}>
                  {cell.events.slice(0, 3).map(ev => {
                    const isPersonal = ev.source === 'personal';
                    return (
                      <div
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        title={`${ev.title} (${isPersonal ? 'Personal M365' : 'Institucional CIES'})`}
                        style={{
                          fontSize: '11px',
                          padding: '2px 5px',
                          borderRadius: '4px',
                          backgroundColor: isPersonal ? '#deecf9' : '#e6f4ea',
                          borderLeft: `3px solid ${isPersonal ? '#0078d4' : '#8cc63f'}`,
                          color: isPersonal ? '#004578' : '#137333',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          cursor: 'pointer',
                          fontWeight: 500
                        }}
                      >
                        {ev.title}
                      </div>
                    );
                  })}
                  {cell.events.length > 3 && (
                    <span style={{ fontSize: '10px', color: '#0078d4', cursor: 'pointer', paddingLeft: '2px' }}>
                      +{cell.events.length - 3} más...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* VISTA AGENDA / LISTADO CRONOLÓGICO */
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
          {agendaEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#605e5c' }}>
              No hay eventos en las capas seleccionadas.
            </div>
          ) : (
            agendaEvents.map(ev => {
              const isPersonal = ev.source === 'personal';
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
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #edebe9',
                    borderLeft: `4px solid ${isPersonal ? '#0078d4' : '#8cc63f'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      backgroundColor: isPersonal ? '#f0f6ff' : '#f4faed',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      minWidth: '70px'
                    }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#605e5c', display: 'block' }}>
                        {dateStr.split(' ')[0]}
                      </span>
                      <strong style={{ fontSize: '15px', color: isPersonal ? '#0078d4' : '#2f7a6b' }}>
                        {dateStr.split(' ')[1]} {dateStr.split(' ')[2]}
                      </strong>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '14px', color: '#201f1e' }}>{ev.title}</strong>
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          backgroundColor: isPersonal ? '#eff6fc' : '#e6f4ea',
                          color: isPersonal ? '#004578' : '#137333',
                          fontWeight: 600
                        }}>
                          {isPersonal ? 'Personal M365' : 'Institucional CIES'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '12px', color: '#605e5c' }}>
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

                  <span style={{ fontSize: '12px', color: '#0078d4', fontWeight: 600 }}>
                    Ver detalles →
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 4. MODAL DETALLE DE EVENTO */}
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
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              animation: 'pop 0.2s ease-out'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header del modal con color de fuente */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: selectedEvent.source === 'personal' ? '#0078d4' : '#2f7a6b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {selectedEvent.source === 'personal' ? <PersonRegular /> : <BuildingRegular />}
                <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {selectedEvent.source === 'personal' ? 'Evento Personal M365 (Outlook)' : 'Evento Institucional CIES'}
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

            {/* Cuerpo del detalle */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#201f1e' }}>
                  {selectedEvent.title}
                </h3>
                {selectedEvent.category && (
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: '#edebe9',
                    color: '#323130'
                  }}>
                    {selectedEvent.category}
                  </span>
                )}
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
                      <strong>Lugar / Canal: </strong>
                      {selectedEvent.location}
                    </span>
                  </div>
                )}

                {selectedEvent.organizer && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckmarkCircle16Regular style={{ color: '#107c10' }} />
                    <span>
                      <strong>Organizador: </strong>
                      {selectedEvent.organizer}
                    </span>
                  </div>
                )}
              </div>

              {/* Botón de acción si tiene link de Teams / Outlook */}
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
                  <Open16Regular /> Abrir en Microsoft 365 / Teams
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
