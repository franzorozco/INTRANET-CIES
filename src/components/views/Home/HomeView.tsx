import * as React from 'react';
import {
  Home24Regular, DocumentBulletList24Regular, FolderPeople24Regular, DataPie24Regular, PersonSupport24Regular,
  Search20Regular, ChevronLeft20Regular, ChevronRight20Regular, ArrowUp24Filled, ArrowDown24Filled,
  Mail16Regular, Call16Regular, Location16Regular, Building16Regular, Comment16Regular,
  ThumbLike16Regular, Trophy24Regular, Megaphone24Regular, Sparkle24Regular
} from '@fluentui/react-icons';
import styles from './HomeView.module.scss';

const quickLinks = [
  { label: 'Inicio', icon: <Home24Regular />, color: '#8cc63f', active: true },
  { label: 'Formularios', icon: <DocumentBulletList24Regular />, color: '#7cc4ad' },
  { label: 'Compartida.CIES', icon: <FolderPeople24Regular />, color: '#4fb3d9' },
  { label: 'Power BI', icon: <DataPie24Regular />, color: '#f2c811' },
  { label: 'Atención al cliente', icon: <PersonSupport24Regular />, color: '#ff7a59' }
];

const tabs = ['Todas', 'Anuncios', 'Eventos', 'Personas', 'Logros'];

const news = [
  { cat: 'Personas', title: 'Historias de éxito: comparte tu experiencia en CIES', author: 'Comunicación', date: '29 Jul 2026', comments: 1, likes: 1, icon: <Trophy24Regular />, bg: 'linear-gradient(135deg,#2f7a6b,#8cc63f)' },
  { cat: 'Anuncios', title: 'Ampliamos nuestro alcance con una nueva oficina', author: 'Dirección', date: '13 Sep 2026', comments: 0, likes: 2, icon: <Megaphone24Regular />, bg: 'linear-gradient(135deg,#0f2a3a,#2f7a6b)' },
  { cat: 'Eventos', title: 'Inauguración de la feria institucional 2026', author: 'RRHH', date: '10 Oct 2026', comments: 5, likes: 3, icon: <Sparkle24Regular />, bg: 'linear-gradient(135deg,#4a5a66,#7cc4ad)' }
];

const staff = [
  { name: 'Andrés Clark', role: 'Director Ejecutivo', dept: 'Dirección', phone: 'No disponible', email: 'andres@cies.org', color: '#8a5a3b' },
  { name: 'María Calderón', role: 'Analista TI', dept: 'Tecnología', phone: '+591 70000000', email: 'maria@cies.org', color: '#2f7a6b' },
  { name: 'Emilia Hunt', role: 'Soporte', dept: 'Atención al Cliente', phone: 'No disponible', email: 'emilia@cies.org', color: '#d6247f' }
];

const kpis = [
  { label: 'Crecimiento de atención', value: '23%', up: true, bg: '#1f4a5c' },
  { label: 'Inversión', value: '5.2%', up: true, bg: '#2f7a6b' },
  { label: 'Nuevos pacientes', value: '27.6K', up: false, bg: '#8cc63f' },
  { label: 'Meta anual 1', value: '9.1M', up: true, bg: '#7cc4ad' },
  { label: 'Meta anual 2', value: '15.3M', up: false, bg: '#4a5a66' }
];

const monthly = [42, 58, 51, 74, 66, 88, 79, 95, 70, 84, 92, 100];
const months = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

const donut = [
  { label: 'Salud', value: 40, color: '#2f7a6b' },
  { label: 'Educación', value: 25, color: '#8cc63f' },
  { label: 'Administración', value: 20, color: '#7cc4ad' },
  { label: 'Otros', value: 15, color: '#0f2a3a' }
];

const initials = (n: string): string => n.split(' ').map(p => p[0]).slice(0, 2).join('');

const Donut: React.FC = () => {
  const r = 60;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg className={styles.donut} width="170" height="170" viewBox="0 0 170 170">
      <g transform="rotate(-90 85 85)">
        {donut.map(d => {
          const len = (d.value / 100) * c;
          const el = (
            <circle key={d.label} cx="85" cy="85" r={r} fill="none" stroke={d.color} strokeWidth="18"
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}>
              <title>{`${d.label}: ${d.value}%`}</title>
            </circle>
          );
          offset += len;
          return el;
        })}
      </g>
      <text x="85" y="82" textAnchor="middle" fontSize="24" fontWeight="800" fill="#0f2a3a">100%</text>
      <text x="85" y="102" textAnchor="middle" fontSize="11" fill="#6b7a86">Presupuesto</text>
    </svg>
  );
};

const Calendar: React.FC = () => {
  const [date, setDate] = React.useState(new Date());
  const y = date.getFullYear();
  const m = date.getMonth();
  const first = (new Date(y, m, 1).getDay() + 6) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const today = new Date();
  const events = [17, 24];
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const label = date.toLocaleDateString('es', { month: 'long', year: 'numeric' });

  return (
    <div className={styles.calendar}>
      <div className={styles.calHead}>
        <button aria-label="Mes anterior" onClick={() => setDate(new Date(y, m - 1, 1))}><ChevronLeft20Regular /></button>
        <span style={{ textTransform: 'capitalize' }}>{label}</span>
        <button aria-label="Mes siguiente" onClick={() => setDate(new Date(y, m + 1, 1))}><ChevronRight20Regular /></button>
      </div>
      <div className={styles.calGrid}>
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => <div key={i} className={styles.dow}>{d}</div>)}
        {cells.map((d, i) => {
          const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
          const cls = [styles.day, !d && styles.dayEmpty, isToday && styles.dayToday, d && events.indexOf(d) >= 0 && styles.dayEvent]
            .filter(Boolean).join(' ');
          return <div key={i} className={cls}>{d || ''}</div>;
        })}
      </div>
      <div className={styles.event}>
        <div className={styles.eventDate}><strong>17</strong><small>Oct</small></div>
        <div className={styles.eventInfo}><strong>Inducción de nuevo personal</strong><span>15:00 - 16:00</span></div>
        <span className={styles.chip}>Encuentro</span>
      </div>
      <div className={styles.event}>
        <div className={styles.eventDate}><strong>24</strong><small>Oct</small></div>
        <div className={styles.eventInfo}><strong>Capacitación en seguridad</strong><span>09:00 - 11:00</span></div>
        <span className={styles.chip}>Formación</span>
      </div>
    </div>
  );
};

export const HomeView: React.FC = () => {
  const [tab, setTab] = React.useState('Todas');
  const [page, setPage] = React.useState(1);
  const [query, setQuery] = React.useState('');
  const filteredNews = tab === 'Todas' ? news : news.filter(n => n.cat === tab);
  const filteredStaff = staff.filter(s => (s.name + s.dept + s.role).toLowerCase().indexOf(query.toLowerCase()) >= 0);
  const max = Math.max(...monthly);

  return (
    <div className={styles.home}>
      {/* HERO */}
      <section className={styles.hero}>
        {[styles.s1, styles.s2, styles.s3, styles.s4, styles.s5, styles.s6].map((s, i) =>
          <span key={i} className={`${styles.shape} ${s}`} />)}
        <h1 className={styles.heroTitle}>¡Bienvenido a <span>INTRANET</span>!</h1>
        <label className={styles.search}>
          <Search20Regular />
          <input id="home-search" placeholder="Buscar formularios y plantillas..." />
        </label>
        <nav className={styles.quickLinks}>
          {quickLinks.map((q, i) => (
            <button key={q.label} id={`ql-${i}`}
              className={`${styles.quickLink} ${q.active ? styles.quickLinkActive : ''}`}
              style={{ animationDelay: `${0.3 + i * 0.1}s`, ['--accent' as string]: q.color } as React.CSSProperties}>
              <span className={styles.qIcon}>{q.icon}</span>
              <span className={styles.qLabel}>{q.label}</span>
            </button>
          ))}
        </nav>
      </section>

      {/* NEWS */}
      <section className={styles.container}>
        <div className={styles.tabs}>
          {tabs.map(t => (
            <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
        <div className={styles.newsGrid}>
          {filteredNews.map((n, i) => (
            <article key={n.title} className={`${styles.newsCard} ${styles.reveal}`} style={{ animationDelay: `${i * 0.12}s` }}>
              <div className={styles.newsCover} style={{ background: n.bg }}>
                <span className={styles.badge}>{n.cat}</span>
                {n.icon}
              </div>
              <div className={styles.newsBody}>
                <div className={styles.meta}><strong>{n.author}</strong> · {n.date}</div>
                <h3 className={styles.newsTitle}>{n.title}</h3>
                <div className={styles.newsFooter}>
                  <span><Comment16Regular /> {n.comments}</span>
                  <span><ThumbLike16Regular /> {n.likes}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className={styles.pager}>
          {[1, 2, 3, 4, 5, 6].map(p => (
            <button key={p} className={page === p ? styles.pageActive : ''} onClick={() => setPage(p)}>{p}</button>
          ))}
        </div>
      </section>

      {/* DIRECTORY + CALENDAR */}
      <section className={`${styles.container} ${styles.twoCol}`}>
        <div>
          <h2 className={styles.sectionTitle}>Directorio</h2>
          <label className={styles.searchSmall}>
            <Search20Regular />
            <input id="staff-search" placeholder="Buscar colaborador..." value={query} onChange={e => setQuery(e.target.value)} />
          </label>
          <div className={styles.filters}>
            <select id="filter-location"><option>Ubicación</option><option>La Paz</option><option>El Alto</option></select>
            <select id="filter-dept"><option>Departamento</option><option>TI</option><option>RRHH</option></select>
          </div>
          <div className={styles.staffGrid}>
            {filteredStaff.map((s, i) => (
              <div key={s.email} className={`${styles.staffCard} ${styles.reveal}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.staffHead}>
                  <div className={styles.avatar} style={{ background: s.color }}>{initials(s.name)}</div>
                  <div><div className={styles.staffName}>{s.name}</div><div className={styles.staffRole}>{s.role}</div></div>
                </div>
                <div className={styles.staffRow}><Building16Regular /><div><small>Departamento</small><span>{s.dept}</span></div></div>
                <div className={styles.staffRow}><Location16Regular /><div><small>Oficina</small><span>No disponible</span></div></div>
                <div className={styles.staffRow}><Call16Regular /><div><small>Teléfono</small><span>{s.phone}</span></div></div>
                <div className={styles.staffRow}><Mail16Regular /><div><small>E-mail</small><span>{s.email}</span></div></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className={styles.sectionTitle}>Calendario</h2>
          <Calendar />
        </div>
      </section>

      {/* CHARTS */}
      <section className={styles.container}>
        <h2 className={styles.sectionTitle}>Indicadores</h2>
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3>Atenciones mensuales</h3>
            <p>Comparativo de la gestión 2026 (miles)</p>
            <div style={{ position: 'relative' }}>
              <div className={styles.bars}>
                {monthly.map((v, i) => (
                  <div key={i} className={styles.barCol}>
                    <div className={styles.bar} data-value={`${v}K`} style={{ height: `${(v / max) * 100}%`, animationDelay: `${i * 0.06}s` }} />
                  </div>
                ))}
              </div>
              <svg viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: 200, pointerEvents: 'none' }}>
                <polyline className={styles.line} fill="none" stroke="#8cc63f" strokeWidth="4" strokeLinecap="round"
                  points={monthly.map((v, i) => `${i * 100 + 50},${200 - (v / max) * 180}`).join(' ')} />
              </svg>
            </div>
            <div className={styles.barLabels}>{months.map((mo, i) => <span key={i}>{mo}</span>)}</div>
          </div>
          <div className={styles.chartCard}>
            <h3>Distribución del presupuesto</h3>
            <p>Por área institucional</p>
            <div className={styles.donutWrap}>
              <Donut />
              <ul className={styles.legend}>
                {donut.map(d => <li key={d.label}><i style={{ background: d.color }} />{d.label} — <strong>{d.value}%</strong></li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className={styles.container}>
        <div className={styles.kpis}>
          {kpis.map((k, i) => (
            <div key={k.label} className={`${styles.kpi} ${styles.reveal}`} style={{ background: k.bg, animationDelay: `${i * 0.1}s` }}>
              <div className={styles.kpiLabel}>{k.label}</div>
              <div className={styles.kpiValue}>{k.value}{k.up ? <ArrowUp24Filled /> : <ArrowDown24Filled />}</div>
              <small>este trimestre</small>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Copyright © 2026 CIES</span>
        <span>Contacto intranet: soporte@cies.org</span>
      </footer>
    </div>
  );
};