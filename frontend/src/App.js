import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [sucursales, setSucursales] = useState([]);
  const [sucursalesInactivas, setSucursalesInactivas] = useState([]);
  const [mostrarInactivas, setMostrarInactivas] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '', 
    telefono: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:3001/api/sucursales';

  // mostrar mensajes
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(''), 4000);
  };

  // sucursales activas
  const fetchSucursales = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setSucursales(response.data);
    } catch (error) {
      showMessage('Error al cargar sucursales', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // sucursales inactivas
  const fetchSucursalesInactivas = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/todas`);
      const inactivas = response.data.filter(sucursal => !sucursal.activa);
      setSucursalesInactivas(inactivas);
    } catch (error) {
      console.error('Error al cargar sucursales inactivas:', error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchSucursales();
    fetchSucursalesInactivas();
  }, [fetchSucursales, fetchSucursalesInactivas]);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  //Envio formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.direccion.trim() || !formData.telefono.trim()) {
      showMessage('Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      setLoading(true);
      
      if (editingId) {
        // Actualizar sucursal
        await axios.put(`${API_URL}/${editingId}`, formData);
        showMessage('Sucursal actualizada correctamente', 'success');
      } else {
        // Crear nueva sucursal
        await axios.post(API_URL, formData);
        showMessage('Sucursal creada correctamente', 'success');
      }
      
      // Limpiar formulario y recargar datos
      resetForm();
      fetchSucursales();
      fetchSucursalesInactivas();
      
    } catch (error) {
      showMessage('Error al guardar la sucursal', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // editar una sucursal
  const handleEdit = (sucursal) => {
    setFormData({
      nombre: sucursal.nombre,
      direccion: sucursal.direccion,
      telefono: sucursal.telefono
    });
    setEditingId(sucursal.id);
  };

  // cancelar edición
  const handleCancelEdit = () => {
    resetForm();
    setEditingId(null);
    showMessage('Edición cancelada', 'info');
  };

  // resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      direccion: '',
      telefono: ''
    });
  };

  // de baja una sucursal
  const handleDarDeBaja = async (id) => {
    if (window.confirm('¿Estás seguro de dar de baja esta sucursal?')) {
      try {
        setLoading(true);
        await axios.put(`${API_URL}/baja/${id}`);
        showMessage('Sucursal dada de baja correctamente', 'success');
        fetchSucursales();
        fetchSucursalesInactivas();
      } catch (error) {
        showMessage('Error al dar de baja la sucursal', 'error');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // alta una sucursal
  const handleDarDeAlta = async (id) => {
    if (window.confirm('¿Estás seguro de dar de alta esta sucursal?')) {
      try {
        setLoading(true);
        await axios.put(`${API_URL}/alta/${id}`);
        showMessage('Sucursal dada de alta correctamente', 'success');
        fetchSucursales();
        fetchSucursalesInactivas();
      } catch (error) {
        showMessage('Error al dar de alta la sucursal', 'error');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // eliminar una sucursal
  const handleEliminarPermanente = async (id) => {
    if (window.confirm('¿Estás seguro de ELIMINAR PERMANENTEMENTE esta sucursal? Esta acción no se puede deshacer.')) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/${id}`);
        showMessage('Sucursal eliminada permanentemente', 'success');
        fetchSucursalesInactivas();
      } catch (error) {
        showMessage('Error al eliminar la sucursal', 'error');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
  <div className="App">
    {}
    <header className="header-fijo">
      <div className="logo-container">
        <img 
          src="https://somoscredito.com/logo/white-logo.webp" 
          alt="Somos Crédito" 
          className="logo"
        />
      </div>
      <div className="titulo-container">
        <h1 className="titulo-principal">Gestión de Sucursales - Somos Crédito</h1>
      </div>
    </header>

    <div className="container">
      {}
        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Formulario */}
        <div className="form-container">
          <h2>{editingId ? 'Editar sucursal' : 'Agregar Nueva Sucursal'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre de la sucursal"
                value={formData.nombre}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={formData.direccion}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={formData.telefono}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Procesando...' : (editingId ? 'Actualizar' : 'Agregar')} Sucursal
              </button>
              
              {editingId && (
                <button type="button" className="btn-secondary" onClick={handleCancelEdit} disabled={loading}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/*mostrar/ocultar sucursales inactivas */}
        <div className="toggle-container">
          <button 
            className={`btn-toggle ${mostrarInactivas ? 'btn-inactivas' : 'btn-activas'}`}
            onClick={() => setMostrarInactivas(!mostrarInactivas)}
          >
            {mostrarInactivas ? 'Ver Sucursales Activas ✅' : 'Ver Sucursales Inactivas ❌ '}
          </button>
        </div>

        {/*Sucursales Activas */}
        {!mostrarInactivas && (
          <div className="table-container">
            <h2>🏢 Sucursales Activas</h2>
            
            {loading && <div className="loading">Cargando sucursales...</div>}
            
            {!loading && sucursales.length === 0 ? (
              <p className="no-data">No hay sucursales activas</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sucursales.map((sucursal) => (
                    <tr key={sucursal.id}>
                      <td>{sucursal.id}</td>
                      <td>{sucursal.nombre}</td>
                      <td>{sucursal.direccion}</td>
                      <td>{sucursal.telefono}</td>
                      <td className="actions">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEdit(sucursal)}
                          disabled={loading || editingId === sucursal.id}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn-baja"
                          onClick={() => handleDarDeBaja(sucursal.id)}
                          disabled={loading}
                        >
                          Dar de Baja
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/*Sucursales Inactivas */}
        {mostrarInactivas && (
          <div className="table-container inactivas">
            <h2>⏸️ Sucursales Inactivas</h2>
            
            {sucursalesInactivas.length === 0 ? (
              <p className="no-data">No hay sucursales inactivas</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sucursalesInactivas.map((sucursal) => (
                    <tr key={sucursal.id} className="fila-inactiva">
                      <td>{sucursal.id}</td>
                      <td>{sucursal.nombre}</td>
                      <td>{sucursal.direccion}</td>
                      <td>{sucursal.telefono}</td>
                      <td className="actions">
                        <button 
                          className="btn-alta"
                          onClick={() => handleDarDeAlta(sucursal.id)}
                          disabled={loading}
                        >
                          Dar de Alta
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleEliminarPermanente(sucursal.id)}
                          disabled={loading}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;