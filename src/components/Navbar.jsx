import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'estudio', label: 'Estudio & IA', icon: '⏱️' },
    { id: 'decidir', label: 'Decidir', icon: '⚖️' },
    { id: 'habitos', label: 'Hábitos', icon: '🔥' },
    { id: 'memoria', label: 'Memoria', icon: '📝' }
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(10px)',
      borderTop: '1px solid #334155',
      display: 'flex',
      justify: 'space-around',
      alignItems: 'center',
      padding: '10px 4px calc(10px + env(safe-area-inset-bottom)) 4px',
      zIndex: 1000
    }}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: active ? '#818cf8' : '#64748b',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              flex: 1,
              padding: '4px 0',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ 
              fontSize: '1.2rem', 
              lineHeight: '1',
              marginBottom: '4px',
              transform: active ? 'scale(1.15)' : 'scale(1)',
              transition: 'transform 0.2s ease'
            }}>
              {tab.icon}
            </span>
            <span style={{ 
              fontSize: '0.68rem', 
              fontWeight: active ? '700' : '500',
              letterSpacing: '0.2px'
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
