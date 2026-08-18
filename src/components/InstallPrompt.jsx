import React, { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [mostrarBanner, setMostrarBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setMostrarBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstalar = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setMostrarBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!mostrarBanner) return null;

  return (
    <div style={{
      margin: '12px',
      padding: '14px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justify: 'space-between',
      boxShadow: '0 8px 20px rgba(124, 58, 237, 0.4)'
    }}>
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>📲 Instalar App</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Accede sin navegador y offline.</div>
      </div>
      <button
        onClick={handleInstalar}
        style={{
          background: '#fff',
          color: '#4f46e5',
          border: 'none',
          padding: '8px 14px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '0.8rem',
          cursor: 'pointer'
        }}
      >
        Instalar
      </button>
    </div>
  );
}
