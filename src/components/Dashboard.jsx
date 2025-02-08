// Dashboard.jsx
import React, { useEffect, useState } from "react";

const Dashboard = ({ token, onClose }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch("http://localhost:5000/get_results", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const json = await res.json();
        if (json.success) {
          setData(json);
        } else {
          setError(json.message);
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchResults();
  }, [token]);

  if (loading) {
    return <div className="p-4">Cargando resultados...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Dashboard de Resultados</h2>
      
      {/* Datos de la Sesión */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Datos de la Sesión</h3>
        {data.sessionData ? (
          <div className="bg-white p-4 rounded shadow">
            <p><strong>ID:</strong> {data.sessionData.id}</p>
            <p><strong>Fecha:</strong> {data.sessionData.session_date}</p>
            <p><strong>Atención Promedio:</strong> {data.sessionData.avg_attention}</p>
            <p><strong>Gaze X Promedio:</strong> {data.sessionData.avg_gaze_x}</p>
            <p><strong>Gaze Y Promedio:</strong> {data.sessionData.avg_gaze_y}</p>
          </div>
        ) : (
          <p>No hay datos de sesión disponibles.</p>
        )}
      </div>
      
      {/* Datos Referenciales */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Datos Referenciales</h3>
        {data.referenceData ? (
          <div className="bg-white p-4 rounded shadow">
            <p><strong>ID:</strong> {data.referenceData.id}</p>
            <p><strong>Fecha:</strong> {data.referenceData.computed_date}</p>
            <p><strong>Atención Promedio:</strong> {data.referenceData.avg_attention}</p>
            <p><strong>Gaze X Promedio:</strong> {data.referenceData.avg_gaze_x}</p>
            <p><strong>Gaze Y Promedio:</strong> {data.referenceData.avg_gaze_y}</p>
          </div>
        ) : (
          <p>No hay datos referenciales disponibles.</p>
        )}
      </div>
      
      {/* Datos Comparativos */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Datos Comparativos</h3>
        {data.comparativeData ? (
          <div className="bg-white p-4 rounded shadow">
            <p><strong>ID:</strong> {data.comparativeData.id}</p>
            <p><strong>Fecha de Comparación:</strong> {data.comparativeData.comparison_date}</p>
            <p><strong>Diferencia de Atención:</strong> {data.comparativeData.diff_attention}</p>
            <p><strong>Diferencia de Gaze X:</strong> {data.comparativeData.diff_gaze_x}</p>
            <p><strong>Diferencia de Gaze Y:</strong> {data.comparativeData.diff_gaze_y}</p>
          </div>
        ) : (
          <p>No hay datos comparativos disponibles.</p>
        )}
      </div>
      
      <button
        onClick={onClose}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Cerrar Dashboard
      </button>
    </div>
  );
};

export default Dashboard;
