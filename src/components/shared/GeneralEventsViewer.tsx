import * as React from 'react';
import {
  CalendarMonth24Regular,
  Location16Regular,
  Clock16Regular,
  Filter20Regular,
  Video16Regular,
  Dismiss20Regular,
  Search20Regular,
  CalendarCheckmark24Regular,
  HeartPulse20Regular,
  PeopleCommunity20Regular,
  BookOpen20Regular,
  Building20Regular
} from '@fluentui/react-icons';
import {
  ICalendarEvent,
  getInstitutionalEvents
} from '../../services/calendarService';
import type { WebPartContext } from '@microsoft/sp-webpart-base';

interface IGeneralEventsViewerProps {
  context?: WebPartContext;
}

const CATEGORY_ICONS: Record<string, React.ReactElement> = {
  'Campaña': <HeartPulse20Regular style={{ color: '#8cc63f' }} />,
  'Salud': <HeartPulse20Regular style={{ color: '#ff7a59' }} />,
  'Capacitación': <BookOpen20Regular style={{ color: '#0078d4' }} />,
  'Institucional': <Building20Regular style={{ color: '#2f7a6b' }} />,
  'Feriado': <CalendarMonth24Regular style={{ color: '#d13438' }} />
};

export const GeneralEventsViewer: React.FC<IGeneralEventsViewerProps> = ({ context }) => {
  const [events, setEvents] = React.useState<ICalendarEvent[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('Todos');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [selectedEvent, setSelectedEvent] = React.useState<ICalendarEvent | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    void getInstitutionalEvents(context)
      .then(data => {
        if (isMounted) setEvents(data);
      })
      .catch(err => {
        console.warn('Error al cargar eventos institucionales:', err);
      });
    return () => { isMounted = false; };
  }, [context]);

  const categories = ['Todos', 'Campaña', 'Capacitación', 'Institucional', 'Salud', 'Feriado'];

  const filteredEvents = events.filter(ev => {
    const matchesCat = selectedCategory === 'Todos' || ev.category === selectedCategory;
    const matchesSearch = searchTerm.trim() === '' ||
      ev.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
      (ev.description && ev.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) ||
      (ev.location && ev.location.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      border: '1px solid #e1dfdd',
      boxShadow: '0 4px 20px rgba(15, 42, 58, 0.06)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 1. HEADER INSTITUCIONAL DEL VISOR DE EVENTOS */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #edebe9',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        background: 'linear-gradient(135deg, #0f2a3a 0%, #163a4f 60%, #2f7a6b 100%)',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: '#8cc63f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            <CalendarMonth24Regular />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.3px' }}>
              Visor de Eventos y Campañas CIES
            </h2>
            <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#c7e0f4' }}>
              Jornadas de salud, asuetos, conferencias y eventos institucionales abiertos a todo el personal
            </p>
          </div>
        </div>

        {/* Buscador Rápido de Eventos */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          padding: '6px 14px',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          minWidth: '240px'
        }}>
          <Search20Regular style={{ color: '#c7e0f4', marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Buscar eventos o sedes..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '13px',
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* 2. BARRA DE CATEGORÍAS FILTRABLES */}
      <div style={{
        padding: '12px 24px',
        backgroundColor: '#faf9f8',
        borderBottom: '1px solid #edebe9',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#605e5c', marginRight: '6px' }}>
          <Filter20Regular style={{ fontSize: '14px' }} />
          <strong>Filtrar por:</strong>
        </div>

        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: selectedCategory === cat ? '1px solid #2f7a6b' : '1px solid #edebe9',
              backgroundColor: selectedCategory === cat ? '#0f2a3a' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : '#323130',
              fontWeight: selectedCategory === cat ? 600 : 500,
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. PARRILLA DE EVENTOS GENERALES */}
      <div style={{
        padding: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {filteredEvents.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '40px 20px',
            color: '#605e5c'
          }}>
            No se encontraron eventos institucionales con los criterios seleccionados.
          </div>
        ) : (
          filteredEvents.map(ev => {
            const dateStr = ev.start.toLocaleDateString('es-BO', {
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
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #edebe9',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.09)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.04)';
                }}
              >
                {/* Franja superior de categoría y badge */}
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: '#f8f9fa',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#323130' }}>
                    {CATEGORY_ICONS[ev.category || 'Institucional'] || <Building20Regular />}
                    <span>{ev.category || 'Institucional'}</span>
                  </div>
                  {ev.highlightBadge && (
                    <span style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: '#eff6fc',
                      color: '#0078d4',
                      fontWeight: 600
                    }}>
                      {ev.highlightBadge}
                    </span>
                  )}
                </div>

                {/* Contenido Principal */}
                <div style={{ padding: '16px', display: 'flex', gap: '14px', flex: 1 }}>
                  {/* Caja de Fecha */}
                  <div style={{
                    backgroundColor: '#0f2a3a',
                    color: '#ffffff',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    textAlign: 'center',
                    minWidth: '56px',
                    height: '56px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1, color: '#8cc63f' }}>
                      {dateStr.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {dateStr.split(' ')[1]}
                    </span>
                  </div>

                  {/* Título y detalles */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#1b2630',
                      lineHeight: 1.3
                    }}>
                      {ev.title}
                    </h3>
                    <p style={{
                      margin: 0,
                      fontSize: '12px',
                      color: '#605e5c',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {ev.description}
                    </p>
                  </div>
                </div>

                {/* Footer de la tarjeta con meta información */}
                <div style={{
                  padding: '10px 16px',
                  backgroundColor: '#faf9f8',
                  borderTop: '1px solid #edebe9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#605e5c'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock16Regular /> {timeStr}
                    </span>
                    {ev.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Location16Regular /> {ev.location.split('/')[0]}
                      </span>
                    )}
                  </div>
                  <span style={{ color: '#0078d4', fontWeight: 600, fontSize: '12px' }}>
                    Ver más →
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. MODAL DETALLE DE EVENTO INSTITUCIONAL */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 42, 58, 0.55)',
          backdropFilter: 'blur(3px)',
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
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 16px 45px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              padding: '16px 20px',
              backgroundColor: '#0f2a3a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarCheckmark24Regular style={{ color: '#8cc63f' }} />
                <span style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Evento Institucional CIES
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
                <h3 style={{ margin: '0 0 8px 0', fontSize: '19px', color: '#1b2630' }}>
                  {selectedEvent.title}
                </h3>
                <span style={{
                  display: 'inline-block',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: '#f3f9eb',
                  color: '#2f7a6b'
                }}>
                  {selectedEvent.category} • {selectedEvent.highlightBadge || 'Institucional'}
                </span>
              </div>

              <p style={{ margin: 0, fontSize: '14px', color: '#4a5a66', lineHeight: 1.5 }}>
                {selectedEvent.description}
              </p>

              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '13px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#323130' }}>
                  <Clock16Regular style={{ color: '#0078d4' }} />
                  <span>
                    <strong>Fecha y Horario: </strong>
                    {selectedEvent.allDay
                      ? `${selectedEvent.start.toLocaleDateString('es-BO')} (Todo el día)`
                      : `${selectedEvent.start.toLocaleDateString('es-BO')} • ${selectedEvent.start.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })} a ${selectedEvent.end.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}`}
                  </span>
                </div>

                {selectedEvent.location && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#323130' }}>
                    <Location16Regular style={{ color: '#8cc63f' }} />
                    <span>
                      <strong>Ubicación / Modalidad: </strong>
                      {selectedEvent.location}
                    </span>
                  </div>
                )}

                {selectedEvent.organizer && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#323130' }}>
                    <PeopleCommunity20Regular style={{ color: '#2f7a6b' }} />
                    <span>
                      <strong>Área Organizadora: </strong>
                      {selectedEvent.organizer}
                    </span>
                  </div>
                )}
              </div>

              {selectedEvent.isTeamsMeeting && (
                <a
                  href={selectedEvent.webLink || 'https://teams.microsoft.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#5b5fc7',
                    color: '#ffffff',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  <Video16Regular /> Unirse a la sesión en Microsoft Teams
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
