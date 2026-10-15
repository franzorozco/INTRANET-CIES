import * as React from 'react';
import {
  DocumentBulletList24Regular, Database24Regular,
  Search20Regular, Dismiss16Regular, Dismiss24Regular, Open16Regular,
  ArrowRight16Regular, ArrowDownload20Regular,
  Apps24Regular, HeartPulse24Regular, Cloud24Regular, Poll24Regular,
  ArrowSync20Regular, ArrowTrending20Regular, ChevronDown16Regular
} from '@fluentui/react-icons';
import styles from './HomeView.module.scss';
import { SmartLink } from './SmartLink';
import {
  navLinks, forms, resources, systems, newPages, downloads
} from './homeLinks';
import {
  dashboardKpis, monthlyTrends, requestDistribution, regionalStats,
  recentActivities, IKpiStat
} from './dashboardData';

const accent = (color?: string): React.CSSProperties =>
  (color ? { ['--accent' as string]: color } : {}) as React.CSSProperties;

export const HomeView: React.FC = () => {
  // Estado para el buscador del banner
  const [query, setQuery] = React.useState('');

  // Modales popups en el banner
  const [isFormsModalOpen, setIsFormsModalOpen] = React.useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = React.useState(false);

  // Filtros internos de modales
  const [modalSearch, setModalSearch] = React.useState('');
  const [resourceCategory, setResourceCategory] = React.useState('Todos');

  // Controles del dashboard
  const [timeframe, setTimeframe] = React.useState<'mes' | 'trimestre' | 'anio'>('mes');
  const [activeChartMetric, setActiveChartMetric] = React.useState<'atenciones' | 'solicitudes'>('atenciones');
  const [hoveredPointIndex, setHoveredPointIndex] = React.useState<number | null>(null);
  const [syncTime, setSyncTime] = React.useState('En tiempo real');

  // Actualizar hora de sincronización
  const handleRefreshSync = (): void => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
    setSyncTime(`Hoy a las ${timeStr}`);
  };

  // Manejar teclado para cerrar modales con ESC
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setIsFormsModalOpen(false);
        setIsResourcesModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevenir scroll en body cuando un modal está abierto
  React.useEffect(() => {
    if (isFormsModalOpen || isResourcesModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setModalSearch('');
    }
  }, [isFormsModalOpen, isResourcesModalOpen]);

  // Lista de categorías únicas para recursos
  const resourceCategories = React.useMemo(() => {
    const cats = new Set<string>();
    cats.add('Todos');
    resources.forEach(r => {
      if (r.category) cats.add(r.category);
    });
    return Array.from(cats);
  }, []);

  // Filtrado de recursos dentro del modal
  const filteredModalResources = React.useMemo(() => {
    const q = modalSearch.trim().toLowerCase();
    return resources.filter(r => {
      const matchText = !q || r.label.toLowerCase().includes(q) || (r.desc && r.desc.toLowerCase().includes(q));
      const matchCat = resourceCategory === 'Todos' || r.category === resourceCategory;
      return matchText && matchCat;
    });
  }, [modalSearch, resourceCategory]);

  // Filtrado de formularios dentro del modal
  const filteredModalForms = React.useMemo(() => {
    const q = modalSearch.trim().toLowerCase();
    return forms.filter(f => {
      return !q || f.label.toLowerCase().includes(q) || (f.desc && f.desc.toLowerCase().includes(q));
    });
  }, [modalSearch]);

  // Cálculo de coordenadas SVG para la gráfica de línea / área interactiva
  const chartWidth = 560;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const currentDataValues = monthlyTrends.map(d =>
    activeChartMetric === 'atenciones' ? d.atenciones : d.solicitudes
  );
  const minVal = Math.min(...currentDataValues) * 0.9;
  const maxVal = Math.max(...currentDataValues) * 1.08;

  const getSvgCoordinates = (val: number, idx: number): { x: number; y: number } => {
    const totalPoints = monthlyTrends.length;
    const x = paddingX + (idx / (totalPoints - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - ((val - minVal) / (maxVal - minVal)) * (chartHeight - paddingY * 2);
    return { x, y };
  };

  const points = currentDataValues.map((v, i) => getSvgCoordinates(v, i));

  // Generar curva Bézier suave
  const generateSmoothPath = (pts: { x: number; y: number }[]): string => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  // Renderizar Sparkline en las tarjetas KPI
  const renderSparkline = (trend: number[], color: string): React.ReactElement => {
    const sw = 180;
    const sh = 34;
    const min = Math.min(...trend);
    const max = Math.max(...trend) || 1;
    const pts = trend.map((v, i) => {
      const x = (i / (trend.length - 1)) * sw;
      const y = sh - 4 - ((v - min) / (max - min || 1)) * (sh - 8);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${sw} ${sh}`} preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pts}
        />
      </svg>
    );
  };

  // Renderizar icono de KPI
  const renderKpiIcon = (name: string): React.ReactElement => {
    switch (name) {
      case 'HeartPulse': return <HeartPulse24Regular />;
      case 'DocumentBulletList': return <DocumentBulletList24Regular />;
      case 'Poll': return <Poll24Regular />;
      default: return <Cloud24Regular />;
    }
  };

  return (
    <div className={styles.home}>
      {/* 1. HERO BANNER PRINCIPAL */}
      <section className={styles.hero}>
        {[styles.s1, styles.s2, styles.s3, styles.s4, styles.s5, styles.s6].map((s, i) => (
          <span key={i} className={`${styles.shape} ${s}`} />
        ))}

        <h1 className={styles.heroTitle}>¡Bienvenido a <span>CIES</span>!</h1>

        {/* Buscador Rápido del Banner */}
        <label className={styles.search}>
          <Search20Regular />
          <input
            id="home-search"
            placeholder="Buscar en el portal, sistemas y formularios..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                setIsResourcesModalOpen(true);
                setModalSearch(query);
              }
            }}
          />
          {query && (
            <button className={styles.clear} onClick={() => setQuery('')} aria-label="Limpiar">
              <Dismiss16Regular />
            </button>
          )}
        </label>

        {/* Barra de accesos directos del Banner con Botones Popups al lado de Atención al Cliente */}
        <nav className={styles.quickLinks}>
          {navLinks.map((n, i) => (
            <SmartLink
              key={n.label}
              id={`ql-${i}`}
              url={n.url}
              newTab={n.newTab}
              title={n.label}
              className={`${styles.quickLink} ${n.active ? styles.quickLinkActive : ''}`}
              style={{ animationDelay: `${0.2 + i * 0.08}s`, ...accent(n.color) }}
            >
              <span className={styles.qIcon}>{n.icon}</span>
              <span className={styles.qLabel}>{n.label}</span>
            </SmartLink>
          ))}

          {/* BOTÓN POPUP 1: FORMULARIOS DE SOLICITUDES (Al lado de Atención al Cliente) */}
          <button
            type="button"
            className={`${styles.quickLink} ${styles.quickLinkPopup}`}
            style={{ animationDelay: '0.52s', ...accent('#7cc4ad') }}
            onClick={() => {
              setIsFormsModalOpen(true);
              setIsResourcesModalOpen(false);
            }}
            title="Abrir Formularios de Solicitudes"
            id="btn-popup-formularios"
          >
            <span className={styles.qIcon}>
              <DocumentBulletList24Regular />
              <span className={styles.popupBadge}>{forms.length}</span>
              <span className={styles.popupIndicator}><ChevronDown16Regular /></span>
            </span>
            <span className={styles.qLabel}>Formularios</span>
          </button>

          {/* BOTÓN POPUP 2: RECURSOS DE USO FRECUENTE (Al lado de Atención al Cliente) */}
          <button
            type="button"
            className={`${styles.quickLink} ${styles.quickLinkPopup}`}
            style={{ animationDelay: '0.6s', ...accent('#4fb3d9') }}
            onClick={() => {
              setIsResourcesModalOpen(true);
              setIsFormsModalOpen(false);
            }}
            title="Abrir Recursos de Uso Frecuente"
            id="btn-popup-recursos"
          >
            <span className={styles.qIcon}>
              <Apps24Regular />
              <span className={styles.popupBadge}>{resources.length}</span>
              <span className={styles.popupIndicator}><ChevronDown16Regular /></span>
            </span>
            <span className={styles.qLabel}>Recursos Frecuentes</span>
          </button>
        </nav>
      </section>

      {/* 2. MODAL POPUP: FORMULARIOS DE SOLICITUDES */}
      {isFormsModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={e => {
            if (e.target === e.currentTarget) setIsFormsModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-forms-title"
        >
          <div className={styles.modalCard} style={{ maxWidth: '780px' }}>
            <header className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <div className={styles.modalHeaderIcon} style={{ background: 'linear-gradient(135deg, #2f7a6b, #8cc63f)' }}>
                  <DocumentBulletList24Regular />
                </div>
                <div>
                  <h3 id="modal-forms-title" className={styles.modalHeaderTitle}>
                    Formularios de Solicitudes
                    <span className={styles.modalHeaderBadge}>{forms.length} trámites</span>
                  </h3>
                  <p className={styles.modalHeaderSubtitle}>Inicia tus trámites institucionales directamente con un clic</p>
                </div>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setIsFormsModalOpen(false)}
                aria-label="Cerrar modal"
              >
                <Dismiss24Regular />
              </button>
            </header>

            <div className={styles.modalSearchBar}>
              <div className={styles.modalSearchInputWrap}>
                <Search20Regular />
                <input
                  type="text"
                  placeholder="Buscar formulario (ej. Uber, BBSS, Soporte, Viaje...)"
                  value={modalSearch}
                  onChange={e => setModalSearch(e.target.value)}
                  autoFocus
                />
                {modalSearch && (
                  <button className={styles.clear} onClick={() => setModalSearch('')}>
                    <Dismiss16Regular />
                  </button>
                )}
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalGrid}>
                {filteredModalForms.map(f => (
                  <SmartLink
                    key={f.label}
                    url={f.url}
                    newTab={f.newTab}
                    title={f.label}
                    className={styles.modalItem}
                  >
                    <div className={styles.modalItemIcon} style={{ background: f.color || '#2f7a6b' }}>
                      {f.icon}
                    </div>
                    <div className={styles.modalItemContent}>
                      {f.category && <span className={styles.modalItemCategory}>{f.category}</span>}
                      <strong>{f.label}</strong>
                      <small>{f.desc || 'Formulario institucional en línea'}</small>
                    </div>
                    <Open16Regular className={styles.modalItemArrow} />
                  </SmartLink>
                ))}
              </div>
              {filteredModalForms.length === 0 && (
                <p style={{ textAlign: 'center', color: '#6b7a86', margin: '30px 0' }}>
                  No se encontraron formularios para “{modalSearch}”.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL POPUP: RECURSOS DE USO FRECUENTE */}
      {isResourcesModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={e => {
            if (e.target === e.currentTarget) setIsResourcesModalOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-resources-title"
        >
          <div className={styles.modalCard}>
            <header className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <div className={styles.modalHeaderIcon} style={{ background: 'linear-gradient(135deg, #0078d4, #4fb3d9)' }}>
                  <Apps24Regular />
                </div>
                <div>
                  <h3 id="modal-resources-title" className={styles.modalHeaderTitle}>
                    Recursos de Uso Frecuente
                    <span className={styles.modalHeaderBadge}>{resources.length} accesos</span>
                  </h3>
                  <p className={styles.modalHeaderSubtitle}>Sistemas, plataformas clínicas y herramientas de trabajo diario</p>
                </div>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setIsResourcesModalOpen(false)}
                aria-label="Cerrar modal"
              >
                <Dismiss24Regular />
              </button>
            </header>

            <div className={styles.modalSearchBar}>
              <div className={styles.modalSearchInputWrap}>
                <Search20Regular />
                <input
                  type="text"
                  placeholder="Filtrar recursos (ej. MEDICARE, DIM, Power BI, Salar, Soporte...)"
                  value={modalSearch}
                  onChange={e => setModalSearch(e.target.value)}
                  autoFocus
                />
                {modalSearch && (
                  <button className={styles.clear} onClick={() => setModalSearch('')}>
                    <Dismiss16Regular />
                  </button>
                )}
              </div>
            </div>

            {/* Pestañas de categoría para filtrar rápido */}
            <div className={styles.modalCategoryTabs}>
              {resourceCategories.map(cat => (
                <button
                  key={cat}
                  className={`${styles.modalTab} ${resourceCategory === cat ? styles.modalTabActive : ''}`}
                  onClick={() => setResourceCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalGrid}>
                {filteredModalResources.map(r => (
                  <SmartLink
                    key={r.label}
                    url={r.url}
                    newTab={r.newTab}
                    title={r.label}
                    className={styles.modalItem}
                  >
                    <div className={styles.modalItemIcon} style={{ background: 'linear-gradient(135deg, #163a4f, #2f7a6b)' }}>
                      {r.icon}
                    </div>
                    <div className={styles.modalItemContent}>
                      {r.category && <span className={styles.modalItemCategory}>{r.category}</span>}
                      <strong>{r.label}</strong>
                      <small>{r.desc || 'Plataforma oficial CIES'}</small>
                    </div>
                    <Open16Regular className={styles.modalItemArrow} />
                  </SmartLink>
                ))}
              </div>
              {filteredModalResources.length === 0 && (
                <p style={{ textAlign: 'center', color: '#6b7a86', margin: '30px 0' }}>
                  No se encontraron recursos para los filtros seleccionados.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. DASHBOARD INSTITUCIONAL COMPLETO (DESPUÉS DEL BANNER) */}
      <section className={styles.dashboardContainer} id="dashboard">
        {/* Controles de Dashboard */}
        <div className={styles.dashboardHeader}>
          <div className={styles.dashboardTitleArea}>
            <h2>
              Tablero de Control Institucional
              <span className={styles.dashboardBadgeLive}>
                <span className={styles.pulsingDot} /> {syncTime}
              </span>
            </h2>
            <p>Monitoreo ejecutivo de servicios clínicos, cumplimiento de solicitudes y disponibilidad operativa</p>
          </div>

          <div className={styles.dashboardControls}>
            <div className={styles.periodPills}>
              <button
                className={`${styles.periodBtn} ${timeframe === 'mes' ? styles.periodBtnActive : ''}`}
                onClick={() => setTimeframe('mes')}
              >
                Mes Actual
              </button>
              <button
                className={`${styles.periodBtn} ${timeframe === 'trimestre' ? styles.periodBtnActive : ''}`}
                onClick={() => setTimeframe('trimestre')}
              >
                Trimestre
              </button>
              <button
                className={`${styles.periodBtn} ${timeframe === 'anio' ? styles.periodBtnActive : ''}`}
                onClick={() => setTimeframe('anio')}
              >
                Gestión 2026
              </button>
            </div>

            <button
              className={styles.quickActionBtn}
              onClick={handleRefreshSync}
              title="Actualizar datos del tablero"
            >
              <ArrowSync20Regular /> Actualizar
            </button>

            <button
              className={styles.quickActionBtn}
              onClick={() => setIsFormsModalOpen(true)}
              style={{ borderColor: '#8cc63f', color: '#2f7a6b' }}
            >
              <DocumentBulletList24Regular /> Trámites ({forms.length})
            </button>
          </div>
        </div>

        {/* Fila de Tarjetas KPI */}
        <div className={styles.kpiGrid}>
          {dashboardKpis.map((kpi: IKpiStat, index: number) => (
            <div
              key={kpi.id}
              className={styles.kpiCard}
              style={{
                ['--kpi-color' as string]: kpi.color,
                animationDelay: `${0.1 + index * 0.08}s`
              } as React.CSSProperties}
            >
              <div className={styles.kpiTop}>
                <div className={styles.kpiIconWrap}>{renderKpiIcon(kpi.iconName)}</div>
                <span className={styles.kpiTrendBadge}>
                  <ArrowTrending20Regular /> {kpi.change}
                </span>
              </div>
              <h4 className={styles.kpiValue}>{kpi.value}</h4>
              <span className={styles.kpiTitle}>{kpi.title}</span>

              <div className={styles.kpiSparklineWrap}>
                {renderSparkline(kpi.trend, kpi.color)}
              </div>

              <div className={styles.kpiFooter}>
                <span>{kpi.period}</span>
                <span>{kpi.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Fila de Gráficas de Datos */}
        <div className={styles.chartsRow}>
          {/* Gráfica 1: Área / Línea de Atenciones y Trámites */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitleWrap}>
                <h3>Evolución y Rendimiento Institucional</h3>
                <p>Comportamiento histórico mensual acumulado a nivel nacional</p>
              </div>

              <div className={styles.chartToggles}>
                <button
                  className={`${styles.chartToggleBtn} ${activeChartMetric === 'atenciones' ? styles.chartToggleActive : ''}`}
                  onClick={() => setActiveChartMetric('atenciones')}
                >
                  Consultas Médicas
                </button>
                <button
                  className={`${styles.chartToggleBtn} ${activeChartMetric === 'solicitudes' ? styles.chartToggleActive : ''}`}
                  onClick={() => setActiveChartMetric('solicitudes')}
                >
                  Solicitudes y Trámites
                </button>
              </div>
            </div>

            <div className={styles.svgChartWrap}>
              <svg className={styles.chartSvg} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2f7a6b" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#8cc63f" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#8cc63f" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Líneas guía horizontales de fondo */}
                {[0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = paddingY + (chartHeight - paddingY * 2) * pct;
                  return (
                    <line
                      key={i}
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke="#eef2f5"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Área bajo la curva con gradiente */}
                <path d={areaPath} fill="url(#chartGradient)" />

                {/* Línea principal Bézier */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="#2f7a6b"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Puntos interactivos con hover */}
                {points.map((pt, i) => {
                  const isHovered = hoveredPointIndex === i;
                  return (
                    <g key={i}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? 6 : 4}
                        fill={isHovered ? '#8cc63f' : '#ffffff'}
                        stroke="#2f7a6b"
                        strokeWidth={isHovered ? 3 : 2}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={() => setHoveredPointIndex(i)}
                        onMouseLeave={() => setHoveredPointIndex(null)}
                      />
                      {/* Etiqueta del mes en el eje X */}
                      <text
                        x={pt.x}
                        y={chartHeight - 6}
                        textAnchor="middle"
                        fontSize="10"
                        fill={isHovered ? '#0f2a3a' : '#8898a6'}
                        fontWeight={isHovered ? '700' : '500'}
                      >
                        {monthlyTrends[i].month}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip dinámico al pasar el mouse por un punto */}
              {hoveredPointIndex !== null && (
                <div
                  className={styles.chartTooltip}
                  style={{
                    left: `${(points[hoveredPointIndex].x / chartWidth) * 100}%`,
                    top: `${(points[hoveredPointIndex].y / chartHeight) * 100}%`
                  }}
                >
                  <span>{monthlyTrends[hoveredPointIndex].month}: </span>
                  <strong>
                    {currentDataValues[hoveredPointIndex].toLocaleString()} {activeChartMetric === 'atenciones' ? 'atenciones' : 'trámites'}
                  </strong>
                </div>
              )}
            </div>
          </div>

          {/* Gráfica 2: Donut Chart de Distribución de Trámites por Área */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitleWrap}>
                <h3>Solicitudes por Área</h3>
                <p>Distribución departamental interna</p>
              </div>
            </div>

            <div className={styles.donutWrap}>
              <div className={styles.donutSvgArea}>
                <svg width="180" height="180" viewBox="0 0 180 180">
                  {(() => {
                    const radius = 64;
                    const strokeWidth = 20;
                    const circumference = 2 * Math.PI * radius;
                    let accumulatedOffset = 0;

                    return requestDistribution.map((item, idx) => {
                      const strokeDash = (item.percentage / 100) * circumference;
                      const strokeDasharray = `${strokeDash} ${circumference - strokeDash}`;
                      const strokeDashoffset = -accumulatedOffset;
                      accumulatedOffset += strokeDash;

                      return (
                        <circle
                          key={idx}
                          cx="90"
                          cy="90"
                          r={radius}
                          fill="transparent"
                          stroke={item.color}
                          strokeWidth={strokeWidth}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          transform="rotate(-90 90 90)"
                          style={{ transition: 'stroke-width 0.3s' }}
                        />
                      );
                    });
                  })()}
                </svg>

                <div className={styles.donutCenterInfo}>
                  <strong>1,420</strong>
                  <span>Trámites CIES</span>
                </div>
              </div>

              {/* Leyenda con Porcentajes */}
              <div className={styles.donutLegend}>
                {requestDistribution.map(item => (
                  <div key={item.category} className={styles.legendItem}>
                    <div className={styles.legendLeft}>
                      <span className={styles.legendDot} style={{ background: item.color }} />
                      <span>{item.category}</span>
                    </div>
                    <span className={styles.legendVal}>{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fila de Rendimiento Regional y Actividad Reciente */}
        <div className={styles.detailsRow}>
          {/* Rendimiento por Regional CIES */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitleWrap}>
                <h3>Cobertura y Metas por Regional CIES</h3>
                <p>Cumplimiento de objetivos de atención médica y trámites</p>
              </div>
            </div>

            <div className={styles.regionalList}>
              {regionalStats.map(reg => (
                <div key={reg.regional} className={styles.regionalItem}>
                  <div className={styles.regionalInfo}>
                    <strong>{reg.regional}</strong>
                    <span>
                      {reg.atenciones.toLocaleString()} / {reg.meta.toLocaleString()} ({reg.completado}%)
                    </span>
                  </div>
                  <div className={styles.progressBarTrack}>
                    <div
                      className={styles.progressBarFill}
                      style={{ width: `${reg.completado}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actividad Reciente & Solicitudes en Tiempo Real */}
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div className={styles.chartTitleWrap}>
                <h3>Actividad y Trámites Recientes</h3>
                <p>Últimos movimientos y solicitudes procesadas en el portal</p>
              </div>
            </div>

            <div className={styles.activityList}>
              {recentActivities.map(act => (
                <div key={act.id} className={styles.activityItem}>
                  <span className={styles.activityDot} style={{ background: act.badgeColor }} />
                  <div className={styles.activityContent}>
                    <strong>{act.title}</strong>
                    <p>{act.author}</p>
                  </div>
                  <div className={styles.activityMeta}>
                    <span className={styles.activityStatusBadge}>{act.status}</span>
                    <span className={styles.activityTime}>{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SISTEMAS PRINCIPALES INSTITUCIONALES (FRANJA MODERNA) */}
      <section id="sistemas" className={styles.systemsBand}>
        <div className={styles.containerInner}>
          <header className={styles.sectionHeader}>
            <span className={styles.sectionIcon}><Database24Regular /></span>
            <div>
              <h2>Accesos a Plataformas Principales</h2>
              <p>Conexión directa a los sistemas clave de operación institucional</p>
            </div>
          </header>

          <div className={styles.systemsGrid}>
            {systems.map((s, i) => (
              <SmartLink
                key={s.label}
                url={s.url}
                newTab={s.newTab}
                title={s.label}
                className={styles.system}
                style={{ animationDelay: `${i * 0.08}s`, ...accent(s.color) }}
              >
                <div className={styles.systemTopRow}>
                  <span className={styles.systemIcon}>{s.icon}</span>
                  <span className={styles.systemUptimeTag}>99.9% Uptime</span>
                </div>
                <strong>{s.label}</strong>
                <small>{s.desc}</small>
                <span className={styles.systemGo}>Ingresar <ArrowRight16Regular /></span>
              </SmartLink>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NUEVAS PÁGINAS + DESCARGAS */}
      <section className={`${styles.container} ${styles.twoCol}`}>
        <div>
          <header className={styles.sectionHeader}>
            <span className={styles.sectionIcon}><Open16Regular /></span>
            <div>
              <h2>Nuevas Páginas e Iniciativas</h2>
              <p>Proyectos de bienestar y tecnología de vanguardia</p>
            </div>
          </header>
          <div className={styles.pagesGrid}>
            {newPages.map((p, i) => (
              <SmartLink
                key={p.label}
                url={p.url}
                newTab={p.newTab}
                title={p.label}
                className={styles.pageCard}
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className={styles.pageCover} style={{ background: p.bg }}>{p.icon}</div>
                <div className={styles.pageBody}>
                  <strong>{p.label}</strong>
                  <small>{p.desc}</small>
                </div>
              </SmartLink>
            ))}
          </div>
        </div>

        <div>
          <header className={styles.sectionHeader}>
            <span className={styles.sectionIcon}><ArrowDownload20Regular /></span>
            <div>
              <h2>Herramientas y Descargas</h2>
              <p>Aplicaciones para soporte y conectividad</p>
            </div>
          </header>
          <div className={styles.downloads}>
            {downloads.map(d => (
              <SmartLink
                key={d.label}
                url={d.url}
                newTab={d.newTab}
                title={d.label}
                className={styles.download}
                style={accent(d.color)}
              >
                <span className={styles.downloadIcon}>{d.icon}</span>
                <div>
                  <strong>{d.label}</strong>
                  <small>{d.desc}</small>
                </div>
                <ArrowDownload20Regular className={styles.downloadArrow} />
              </SmartLink>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOOTER INSTITUCIONAL */}
      <footer className={styles.footer}>
        <span>Copyright © 2026 CIES Salud Sexual Salud Reproductiva</span>
        <span>Mesa de Ayuda Intranet: soporte@cies.org.bo</span>
      </footer>
    </div>
  );
};