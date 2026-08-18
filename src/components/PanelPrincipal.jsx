import React from 'react';
import AjustesBackup from './AjustesBackup';
import InstallPrompt from './InstallPrompt';

export default function PanelPrincipal() {
  return (
    <div style={{ padding: '10px' }}>
      <InstallPrompt />

      <div className="card">
        <div className="card-title">🧠 Bienvenido a tu Second Brain</div>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.4', marginTop: '6px' }}>
          Tu centro de control local y privado para organizar decisiones, mantener disciplina con tus hábitos y estudiar con IA.
        </p>
      </div>

      <AjustesBackup />
    </div>
  );
}
