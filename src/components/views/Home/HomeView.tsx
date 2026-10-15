import * as React from 'react';
import { Title2, Body1, Card } from '@fluentui/react-components';

export const HomeView: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card style={{ padding: '24px' }}>
        <Title2>Inicio - Intranet Corporativa CIES</Title2>
        <Body1 style={{ color: '#605e5c', marginTop: '8px' }}>
          Página principal de la intranet. Lista para estructurar los accesos directos, formularios y noticias.
        </Body1>
      </Card>
    </div>
  );
};