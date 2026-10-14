import * as React from 'react';
import { Title2, Body1, Card } from '@fluentui/react-components';

export const HomeView: React.FC = () => (
  <Card style={{ padding: '24px', margin: '16px' }}>
    <Title2>Portal Principal de Intranet</Title2>
    <Body1>Bienvenido a la intranet corporativa. Esta vista es accesible para todos los colaboradores.</Body1>
  </Card>
);