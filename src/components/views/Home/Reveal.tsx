import * as React from 'react';
import styles from './HomeView.module.scss';

interface IRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  as?: 'div' | 'section';
}

/**
 * Envuelve contenido y lo anima (fade + slide) cuando entra en el viewport.
 * Usa IntersectionObserver; si no existe, muestra el contenido de inmediato.
 */
export const Reveal: React.FC<IRevealProps> = ({ children, className = '', delay = 0, id, as = 'div' }) => {
  const ref = React.useRef<HTMLElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      });
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag
      id={id}
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.revealVisible : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
};
