import * as React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomeView.module.scss';

interface ISmartLinkProps {
  url: string;
  newTab?: boolean;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  id?: string;
  children: React.ReactNode;
}

/**
 * Resuelve el tipo de enlace automáticamente:
 *  - ''           -> deshabilitado ("Próximamente")
 *  - '#seccion'   -> scroll suave a la sección (compatible con HashRouter)
 *  - '/ruta'      -> ruta interna con react-router
 *  - 'https://..' -> enlace externo (nueva pestaña por defecto)
 */
export const SmartLink: React.FC<ISmartLinkProps> = ({ url, newTab = true, className = '', style, title, id, children }) => {
  const u = (url || '').trim();

  if (!u) {
    return (
      <a id={id} href="#" className={`${className} ${styles.disabled}`} style={style}
        title={`${title || ''} · Próximamente`} aria-disabled="true"
        onClick={e => e.preventDefault()} data-soon="Próximamente">
        {children}
      </a>
    );
  }

  if (u.charAt(0) === '#') {
    return (
      <a id={id} href={u} className={className} style={style} title={title}
        onClick={e => {
          e.preventDefault();
          document.getElementById(u.slice(1))?.scrollIntoView({ behavior: 'smooth' });
        }}>
        {children}
      </a>
    );
  }

  if (u.charAt(0) === '/') {
    return <Link id={id} to={u} className={className} style={style} title={title}>{children}</Link>;
  }

  return (
    <a id={id} href={u} className={className} style={style} title={title}
      target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined}>
      {children}
    </a>
  );
};
