import React from 'react';

export default function AjustesBackup() {
  const exportarDatos = () => {
    try {
      const backup = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        backup[key] = localStorage.getItem(key);
      }
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `second_brain_backup_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      alert("Error al exportar datos: " + e.message);
    }
  };

  const importarDatos = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        Object.keys(data).forEach((key) => {
          localStorage.setItem(key, data[key]);
        });
        alert("¡Datos restaurados con éxito! Se recargará la página.");
        window.location.reload();
      } catch (err) {
        alert("Error al importar el archivo de copia de seguridad.");
      }
    };
    if (event.target.files[0]) {
      fileReader.readAsText(event.target.files[0]);
    }
  };

  return (
    <div className="card" style={{ marginTop: '15px', background: '#1e293b', padding: '15px', borderRadius: '10px' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#f8fafc' }}>💾 Respaldo y Datos</h3>
      <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '15px' }}>
        Exporta o restaura toda tu información local de forma privada.
      </p>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={exportarDatos} 
          style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
        >
          📥 Descargar Copia
        </button>

        <label style={{ background: '#334155', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
          📤 Restaurar Copia
          <input type="file" accept=".json" onChange={importarDatos} style={{ display: 'none' }} />
        </label>
      </div>
    </div>
  );
}
