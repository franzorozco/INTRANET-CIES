import * as React from 'react';
import styles from './CapacitacionesView.module.scss';
import {
  BrainCircuit24Regular,
  Bot24Regular,
  Sparkle24Regular,
  PlayCircle24Regular,
  ArrowRight20Regular,
  ChevronRight20Regular,
  CheckmarkCircle20Regular,
  Search20Regular,
  Dismiss20Regular,
  Open20Regular,
  Timer20Regular
} from '@fluentui/react-icons';
import { Link } from 'react-router-dom';
import bannerImg from '../../../assets/image/capacitaciones/banner.jpg';
import conectandoImg from '../../../assets/image/capacitaciones/conectando.jpg';
import nvidiaImg from '../../../assets/image/capacitaciones/nvidia.jpg';
import copilotM365Img from '../../../assets/image/capacitaciones/microsoft.png';
import copilotStudioImg from '../../../assets/image/capacitaciones/copilot.png';

export const CapacitacionesView: React.FC = () => {
  // Estados de interacción
  const [filterCategory, setFilterCategory] = React.useState<string>('todos');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [activeModalVideo, setActiveModalVideo] = React.useState<boolean>(false);

  return (
    <div className={styles.capacitacionesContainer}>
      {/* Barra de Migas de Pan (Breadcrumbs) */}
      <nav className={styles.breadcrumbs} aria-label="Ruta de navegación">
        <Link to="/" className={styles.breadcrumbLink}>Inicio</Link>
        <ChevronRight20Regular className={styles.breadcrumbSeparator} />
        <span className={styles.breadcrumbActive}>Capacitaciones & IA</span>
      </nav>

      {/* Hero Banner Impactante */}
      <header className={styles.heroBanner}>
        <div className={styles.heroBackground}>
          <img src={bannerImg} alt="Banner IA CIES" className={styles.heroImg} />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroTag}>
            <BrainCircuit24Regular />
            <span>Campus Virtual Institucional CIES</span>
          </div>
          <h1 className={styles.heroTitle}>Bienvenido a tus cursos de Inteligencia Artificial</h1>
          <p className={styles.heroSubtitle}>
            Aprende a trabajar con inteligencia artificial directamente en las herramientas que usas cada día,
            y a crear tus propios agentes automatizados.
          </p>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <strong>5 Módulos</strong>
              <span>Especializados</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <strong>100% Online</strong>
              <span>A tu propio ritmo</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <strong>Certificación</strong>
              <span>Competencias TI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Barra de Filtros y Búsqueda Interactiva */}
      <section className={styles.filterBar}>
        <div className={styles.categoryPills}>
          <button
            type="button"
            className={`${styles.pillBtn} ${filterCategory === 'todos' ? styles.pillActive : ''}`}
            onClick={() => setFilterCategory('todos')}
          >
            Todos los cursos
          </button>
          <button
            type="button"
            className={`${styles.pillBtn} ${filterCategory === 'ia' ? styles.pillActive : ''}`}
            onClick={() => setFilterCategory('ia')}
          >
            Inteligencia Artificial
          </button>
          <button
            type="button"
            className={`${styles.pillBtn} ${filterCategory === 'copilot' ? styles.pillActive : ''}`}
            onClick={() => setFilterCategory('copilot')}
          >
            Copilot & Microsoft 365
          </button>
          <button
            type="button"
            className={`${styles.pillBtn} ${filterCategory === 'nvidia' ? styles.pillActive : ''}`}
            onClick={() => setFilterCategory('nvidia')}
          >
            NVIDIA Deep Learning
          </button>
        </div>

        <div className={styles.searchBox}>
          <Search20Regular className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar tema, agente o herramienta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery('')}
            >
              <Dismiss20Regular />
            </button>
          )}
        </div>
      </section>

      {/* Contenido Principal de Cursos (Tarjetas Alternadas con Diseño Premium) */}
      <main className={styles.coursesGrid}>

        {/* CURSO 1: Conectando Territorios */}
        {(filterCategory === 'todos' || filterCategory === 'ia') && (
          <article className={`${styles.courseCard} ${styles.rowReversed}`}>
            <div className={styles.imageCol}>
              <div className={styles.imageWrapper}>
                <img src={conectandoImg} alt="Transforma tu aprendizaje en oportunidades" className={styles.courseImg} />
                <div className={styles.badgeOverImage}>
                  <Sparkle24Regular /> Inclusivo & Digital
                </div>
              </div>
            </div>
            <div className={styles.infoCol}>
              <div className={styles.categoryBadge}>
                <span className={styles.categoryDot} />
                INTELIGENCIA ARTIFICIAL
              </div>
              <h2 className={styles.courseTitle}>
                Transforma tu aprendizaje en oportunidades - Conectando Territorios
              </h2>
              <div className={styles.courseTextList}>
                <p>
                  <strong>¿Para quién es?</strong> Estos cursos son para ti, sin importar dónde estés, tu nivel de
                  tecnología o conocimientos previos. Iníciate en IA, programación y ciberseguridad sin necesidad de experiencia previa.
                </p>
                <p>
                  <strong>Quiero actualizarme.</strong> Desarrolla competencias digitales sin dejar de trabajar. A tu propio ritmo.
                </p>
                <p>
                  <strong>Quiero reinventarme.</strong> Sin importar tu edad o experiencia, los cursos parten desde lo más básico y práctico.
                </p>
              </div>
              <div className={styles.cardActions}>
                <a
                  href="https://conectandoterritorios.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
                >
                  Obtener más información <Open20Regular />
                </a>
                <span className={styles.durationTag}>
                  <Timer20Regular /> Flexible · Sin costo para colaboradores CIES
                </span>
              </div>
            </div>
          </article>
        )}

        {/* CURSO 2: NVIDIA Deep Learning */}
        {(filterCategory === 'todos' || filterCategory === 'nvidia' || filterCategory === 'ia') && (
          <article className={styles.courseCard}>
            <div className={styles.infoCol}>
              <div className={styles.categoryBadge}>
                <span className={styles.categoryDot} style={{ background: '#76b900' }} />
                NVIDIA DEEP LEARNING INSTITUTE
              </div>
              <h2 className={styles.courseTitle}>
                Cursos de Capacitación en Línea - NVIDIA
              </h2>
              <p className={styles.courseParagraph}>
                El Instituto de Deep Learning de NVIDIA (DLI) puede ayudarte, si eres una persona en busca de
                acreditación/formación en línea y estás proactivo en una organización que quiere desarrollar las
                habilidades de su equipo de trabajo.
              </p>
              <p className={styles.courseParagraph}>
                Aprende a configurar un proyecto integral en menos de ocho horas o a aplicar una tecnología o técnica
                de desarrollo específica en dos horas; en cualquier momento y lugar, con solo una computadora y una
                conexión a Internet. Algunos cursos ofrecen un certificado de competencia para apoyar el crecimiento profesional.
              </p>
              <div className={styles.cardActions}>
                <a
                  href="https://www.nvidia.com/es-la/training/online/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.primaryBtn} ${styles.nvidiaBtn}`}
                >
                  Inicia con tu aprendizaje <ArrowRight20Regular />
                </a>
                <span className={styles.certificatePill}>
                  <CheckmarkCircle20Regular /> Certificación Oficial NVIDIA DLI
                </span>
              </div>
            </div>
            <div className={styles.imageCol}>
              <div className={styles.imageWrapper}>
                <img src={nvidiaImg} alt="Cursos de Capacitación en Línea NVIDIA" className={styles.courseImg} />
                <div className={styles.copilotBadge}>
                  <Sparkle24Regular />
                </div>
              </div>
            </div>
          </article>
        )}

        {/* CURSO 3: Capacitación 2 - Agentes Copilot Studio CIES (Video) */}
        {(filterCategory === 'todos' || filterCategory === 'copilot' || filterCategory === 'ia') && (
          <article className={`${styles.courseCard} ${styles.rowReversed}`}>
            <div className={styles.imageCol}>
              <div className={styles.videoThumbnailWrapper} onClick={() => setActiveModalVideo(true)}>
                <div className={styles.videoSimulatedScreen}>
                  <div className={styles.videoTopBar}>
                    <span className={styles.videoDot} />
                    <span className={styles.videoDot} />
                    <span className={styles.videoDot} />
                    <span className={styles.videoTitleBar}>Capacitación 2 - Agentes Copilot Studio - CIES</span>
                  </div>
                  <div className={styles.videoContentPreview}>
                    <div className={styles.meetingGrid}>
                      <div className={styles.speakerTile}>
                        <span>Sesión en Vivo Grabada</span>
                      </div>
                      <div className={styles.attendeeTile} />
                      <div className={styles.attendeeTile} />
                      <div className={styles.attendeeTile} />
                    </div>
                    <div className={styles.playButtonOverlay}>
                      <div className={styles.playIconPulse}>
                        <PlayCircle24Regular />
                      </div>
                      <span className={styles.playLabel}>Reproducir Capacitación (45 min)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.infoCol}>
              <div className={styles.categoryBadge}>
                <span className={styles.categoryDot} style={{ background: '#0078d4' }} />
                PODER 8 · AGENTES INTELIGENTES
              </div>
              <h2 className={styles.courseTitle}>
                Agentes IA CIES
              </h2>
              <p className={styles.courseParagraph}>
                CIES incorpora <strong>cinco agentes de inteligencia artificial</strong> para apoyar el trabajo diario y
                agilizar la toma de decisiones:
              </p>
              <div className={styles.agentsChipsGrid}>
                <span className={styles.agentChip} title="Agente de Talento Humano & Consultas">TD Bot</span>
                <span className={styles.agentChip} title="Agente de Auditoría Financiera">SAPIA Fin</span>
                <span className={styles.agentChip} title="Agente de Dirección y Reportes Ejecutivos">PAUL</span>
                <span className={styles.agentChip} title="Atención y Orientación al Público">CIES para todxs</span>
                <span className={styles.agentChip} title="Conciliación Bancaria y Finanzas">CoCoBo</span>
              </div>
              <p className={styles.courseParagraph}>
                Cada uno resuelve tareas concretas —consultas institucionales y públicas, auditoría financiera,
                análisis para dirección, atención al público y conciliación bancaria— trabajando siempre sobre
                las fuentes oficiales seguras de CIES.
              </p>
              <div className={styles.cardActions}>
                <button
                  type="button"
                  onClick={() => setActiveModalVideo(true)}
                  className={styles.primaryBtn}
                >
                  <PlayCircle24Regular /> Ver Video de Capacitación
                </button>
              </div>
            </div>
          </article>
        )}

        {/* CURSO 4: Copilot en Microsoft 365 */}
        {(filterCategory === 'todos' || filterCategory === 'copilot') && (
          <article className={styles.courseCard}>
            <div className={styles.infoCol}>
              <div className={styles.categoryBadge}>
                <span className={styles.categoryDot} style={{ background: '#6264a7' }} />
                MICROSOFT 365 ECOSYSTEM
              </div>
              <h2 className={styles.courseTitle}>
                Copilot en Microsoft 365
              </h2>
              <p className={styles.courseParagraph}>
                Microsoft Copilot está integrado de forma nativa en las aplicaciones de M365. No es una herramienta aparte,
                sino un asistente de IA que convive en <strong>Word, Excel, PowerPoint, Teams y Outlook</strong> para
                ayudarte a redactar, analizar, resumir y comunicarte mucho más rápido, usando lenguaje natural en español.
              </p>
              <div className={styles.appIconsRow}>
                <span className={styles.appPill} style={{ background: '#5b5fc7' }}>Teams</span>
                <span className={styles.appPill} style={{ background: '#0078d4' }}>Outlook</span>
                <span className={styles.appPill} style={{ background: '#185abd' }}>Word</span>
                <span className={styles.appPill} style={{ background: '#107c41' }}>Excel</span>
                <span className={styles.appPill} style={{ background: '#c43e1c' }}>PowerPoint</span>
              </div>
              <div className={styles.cardActions}>
                <a
                  href="https://learn.microsoft.com/es-es/training/paths/copilot-microsoft-365/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
                >
                  Iniciar curso <ArrowRight20Regular />
                </a>
              </div>
            </div>
            <div className={styles.imageCol}>
              <div className={styles.imageWrapper}>
                <img src={copilotM365Img} alt="Microsoft 365 Copilot" className={styles.courseImg} />
                <div className={styles.badgeOverImage}>
                  <Sparkle24Regular /> M365 Copilot
                </div>
              </div>
            </div>
          </article>
        )}

        {/* CURSO 5: Copilot Studio — Crea tus propios agentes de IA */}
        {(filterCategory === 'todos' || filterCategory === 'copilot' || filterCategory === 'ia') && (
          <article className={`${styles.courseCard} ${styles.rowReversed}`}>
            <div className={styles.imageCol}>
              <div className={styles.imageWrapper}>
                <img src={copilotStudioImg} alt="Copilot Studio" className={styles.courseImg} />
                <div className={styles.badgeOverImage}>
                  <Bot24Regular /> Agentes IA
                </div>
              </div>
            </div>
            <div className={styles.infoCol}>
              <div className={styles.categoryBadge}>
                <span className={styles.categoryDot} style={{ background: '#00a4ef' }} />
                PODER 8 · DESARROLLO SIN CÓDIGO
              </div>
              <h2 className={styles.courseTitle}>
                Copilot Studio — Crea tus propios agentes de IA
              </h2>
              <p className={styles.courseParagraph}>
                Copilot Studio te permite diseñar agentes conversacionales inteligentes <strong>sin necesidad de escribir código</strong>.
                Un agente es un asistente virtual que responde preguntas, ejecuta acciones y automatiza procesos,
                conectado a tus propias fuentes de información y sistemas como <strong>SharePoint, Dataverse o APIs REST</strong>.
              </p>
              <p className={styles.courseParagraph}>
                Ideal para asistentes de RRHH, soporte interno de TI, consultas de inventario, protocolos de salud y más.
              </p>
              <div className={styles.cardActions}>
                <a
                  href="https://learn.microsoft.com/es-es/training/paths/work-with-copilot-studio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
                >
                  Comenzar la ruta de formación <ArrowRight20Regular />
                </a>
              </div>
            </div>
          </article>
        )}

      </main>



      {/* Footer de Créditos y Enlaces Institucionales */}
      <footer className={styles.capacitacionesFooter}>
        <div className={styles.footerLinks}>
          <a href="#">Póngase en contacto con nosotros</a>
          <span className={styles.footerDot}>•</span>
          <a href="#">Términos de uso</a>
          <span className={styles.footerDot}>•</span>
          <a href="#">Directiva de privacidad</a>
          <span className={styles.footerDot}>•</span>
          <a href="#">Información legal CIES</a>
        </div>
        <p className={styles.footerCopyright}>
          © {new Date().getFullYear()} CIES Salud Sexual y Reproductiva · Todos los derechos reservados.
        </p>
      </footer>

      {/* Modal Reproductor de Video de Capacitación */}
      {activeModalVideo && (
        <div className={styles.videoModalBackdrop} onClick={() => setActiveModalVideo(false)}>
          <div className={styles.videoModalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderTitle}>
                <PlayCircle24Regular />
                <h3>Capacitación 2 - Agentes Copilot Studio - CIES</h3>
              </div>
              <button
                type="button"
                className={styles.closeModalBtn}
                onClick={() => setActiveModalVideo(false)}
              >
                <Dismiss20Regular />
              </button>
            </div>
            <div className={styles.modalVideoPlayerArea}>
              <div className={styles.iframeResponsiveContainer}>
                <iframe
                  className={styles.iframeVideoPlayer}
                  src="https://ciesbo.sharepoint.com/sites/intranet/_layouts/15/embed.aspx?UniqueId=6c50a874-d2cc-4377-9de8-49d157077253&embed=%7B%22af%22%3Atrue%2C%22ust%22%3Atrue%7D&referrer=StreamWebApp&referrerScenario=EmbedDialog.Create"
                  title="Capacitación 2 - Agentes Copilot Studio - CIES-20260731_200418-Grabación de la reunión-904767.mp4"
                  allowFullScreen
                  scrolling="no"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
