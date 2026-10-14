import * as React from 'react';
import { Title2, Body1, Card } from '@fluentui/react-components';

export const AdminView: React.FC = () => (
  <Card style={{ padding: '24px', margin: '16px' }}>
    <Title2>Módulo de Configuración y Administración</Title2>
    <Body1>Vista protegida. Solo visible para usuarios miembros del grupo correspondiente.</Body1>
  </Card>
);