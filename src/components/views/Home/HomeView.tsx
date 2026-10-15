import * as React from 'react';
import {
  DocumentBulletList24Regular, Globe24Regular, Database24Regular,
  Search20Regular, Dismiss16Regular, Open16Regular, ArrowRight16Regular, ArrowDownload20Regular
} from '@fluentui/react-icons';
import styles from './HomeView.module.scss';
import { SmartLink } from './SmartLink';
import { ILinkItem, navLinks, forms, resources, systems, newPages, downloads } from './homeLinks';

const accent = (color?: string): React.CSSProperties =>
  (color ? { ['--accent' as string]: color } : {}) as React.CSSProperties;

const SectionHeader: React.FC<{ icon: React.ReactElement; title: string; subtitle?: string; count?: number }> =
  ({ icon, title, subtitle, count }) => (
    <header className={styles.sectionHeader}>
      <span className={styles.sectionIcon}>{icon}</span>
      <div>
        <h2>{title}{count !== undefined && <span className={styles.count}>{count}</span>}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );

const Tile: React.FC<{ item: ILinkItem; index: number; variant?: 'form' | 'res' }> = ({ item, index, variant = 'res' }) => (
  <SmartLink url={item.url} newTab={item.newTab} title={item.label}
    className={`${styles.tile} ${variant === 'form' ? styles.tileForm : ''}`}
    style={{ animationDelay: `${index * 0.04}s` }}>
    <span className={styles.tileIcon}>{item.icon}</span>
    <span className={styles.tileLabel}>{item.label}</span>
    <Open16Regular className={styles.tileOpen} />
  </SmartLink>
);

export const HomeView: React.FC = () => {
  const [query, setQuery] = React.useState('');
  const q = query.trim().toLowerCase();
  const match = (i: ILinkItem): boolean => !q || i.label.toLowerCase().indexOf(q) >= 0;
  const fForms = forms.filter(match);
  const fRes = resources.filter(match);

  return (
    <div className={styles.home}>
      {/* HERO */}
      <section className={styles.hero}>
        {[styles.s1, styles.s2, styles.s3, styles.s4, styles.s5, styles.s6].map((s, i) =>
          <span key={i} className={`${styles.shape} ${s}`} />)}
        <h1 className={styles.heroTitle}>¡Bienvenido a <span>CIES</span>!</h1>
        <label className={styles.search}>
          <Search20Regular />
          <input id="home-search" placeholder="Buscar formularios y sistemas..." value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && document.getElementById('formularios')?.scrollIntoView({ behavior: 'smooth' })} />
          {query && <button className={styles.clear} onClick={() => setQuery('')} aria-label="Limpiar"><Dismiss16Regular /></button>}
        </label>
        <nav className={styles.quickLinks}>
          {navLinks.map((n, i) => (
            <SmartLink key={n.label} id={`ql-${i}`} url={n.url} newTab={n.newTab} title={n.label}
              className={`${styles.quickLink} ${n.active ? styles.quickLinkActive : ''}`}
              style={{ animationDelay: `${0.3 + i * 0.1}s`, ...accent(n.color) }}>
              <span className={styles.qIcon}>{n.icon}</span>
              <span className={styles.qLabel}>{n.label}</span>
            </SmartLink>
          ))}
        </nav>
      </section>

      {/* FORMULARIOS */}
      <section id="formularios" className={styles.container}>
        <div className={styles.panel}>
          <SectionHeader icon={<DocumentBulletList24Regular />} title="Formularios de solicitudes"
            subtitle="Inicia tus trámites internos en un clic" count={fForms.length} />
          <div className={styles.formGrid}>
            {fForms.map((f, i) => <Tile key={f.label} item={f} index={i} variant="form" />)}
          </div>
          {!fForms.length && <p className={styles.empty}>Sin resultados para “{query}”.</p>}
        </div>
      </section>

      {/* RECURSOS */}
      <section id="recursos" className={styles.container}>
        <div className={styles.panel}>
          <SectionHeader icon={<Globe24Regular />} title="Recursos de uso frecuente"
            subtitle="Sistemas y plataformas institucionales" count={fRes.length} />
          <div className={styles.resGrid}>
            {fRes.map((r, i) => <Tile key={r.label} item={r} index={i} />)}
          </div>
          {!fRes.length && <p className={styles.empty}>Sin resultados para “{query}”.</p>}
        </div>
      </section>

      {/* SISTEMAS */}
      <section id="sistemas" className={styles.systemsBand}>
        <div className={styles.containerInner}>
          <SectionHeader icon={<Database24Regular />} title="Accesos a sistemas" subtitle="Ingresa directamente a las plataformas principales" />
          <div className={styles.systemsGrid}>
            {systems.map((s, i) => (
              <SmartLink key={s.label} url={s.url} newTab={s.newTab} title={s.label} className={styles.system}
                style={{ animationDelay: `${i * 0.08}s`, ...accent(s.color) }}>
                <span className={styles.systemIcon}>{s.icon}</span>
                <strong>{s.label}</strong>
                <small>{s.desc}</small>
                <span className={styles.systemGo}>Ingresar <ArrowRight16Regular /></span>
              </SmartLink>
            ))}
          </div>
        </div>
      </section>

      {/* NUEVAS PÁGINAS + DESCARGAS */}
      <section className={`${styles.container} ${styles.twoCol}`}>
        <div>
          <SectionHeader icon={<Open16Regular />} title="Nuevas páginas" />
          <div className={styles.pagesGrid}>
            {newPages.map((p, i) => (
              <SmartLink key={p.label} url={p.url} newTab={p.newTab} title={p.label} className={styles.pageCard}
                style={{ animationDelay: `${i * 0.12}s` }}>
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
          <SectionHeader icon={<ArrowDownload20Regular />} title="Descargas" />
          <div className={styles.downloads}>
            {downloads.map(d => (
              <SmartLink key={d.label} url={d.url} newTab={d.newTab} title={d.label} className={styles.download} style={accent(d.color)}>
                <span className={styles.downloadIcon}>{d.icon}</span>
                <div><strong>{d.label}</strong><small>{d.desc}</small></div>
                <ArrowDownload20Regular className={styles.downloadArrow} />
              </SmartLink>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Copyright © 2026 CIES</span>
        <span>Contacto intranet: soporte@cies.org</span>
      </footer>
    </div>
  );
};