import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './styles.css';
import './revision-10.css';

const prototype = new URLSearchParams(window.location.search).get('prototype');

async function renderExperience() {
  let experience = <App />;

  if (prototype === 'typography') {
    const { TypographySpecimen } = await import('./prototypes/TypographySpecimen');
    experience = <TypographySpecimen />;
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      {experience}
    </StrictMode>,
  );
}

void renderExperience();
