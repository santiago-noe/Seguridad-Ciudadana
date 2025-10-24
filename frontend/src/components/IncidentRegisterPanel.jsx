import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Configurar axios
axios.defaults.baseURL = 'http://127.0.0.1:4000';

function LocationSelector({ onSelect, value }) {
  useMapEvents({
    async click(e) {
      // Llamada a Nominatim para obtener el nombre del lugar
      const { lat, lng } = e.latlng;
      let address = '';
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        address = data.display_name || '';
      } catch (err) {
        address = '';
      }
      onSelect({ lat, lng, address });
    },
  });
  return value ? <Marker position={value} /> : null;
}

const IncidentRegisterPanel = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState({ 
    descripcion: '', 
    direccion: '', 
    latlng: null,
    categoria: '', // 'falta' o 'delito'
    cod_tipofalta: '',
    cod_tipodelito: ''
  });
  const [tipos, setTipos] = useState({
    incidencias: [],
    faltas: [],
    delitos: []
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTipos, setLoadingTipos] = useState(true);
  const { user } = useAuth();

  // Cargar tipos de incidencia, falta y delito
  useEffect(() => {
    const loadTipos = async () => {
      try {
        setLoadingTipos(true);
        const response = await axios.get('/api/tipos');
        console.log('🔍 Respuesta de tipos:', response.data);
        if (response.data && response.data.success) {
          setTipos(response.data.tipos);
          console.log('✅ Tipos cargados:', response.data.tipos);
        }
      } catch (error) {
        console.error('Error al cargar tipos:', error);
        setErrorMsg('Error al cargar tipos de incidencia');
      } finally {
        setLoadingTipos(false);
      }
    };

    loadTipos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia la categoría, limpiar los campos de tipo
    if (name === 'categoria') {
      setForm({ 
        ...form, 
        [name]: value,
        cod_tipofalta: '',
        cod_tipodelito: ''
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleMapSelect = (latlngObj) => {
    // Si latlngObj tiene address, lo ponemos en el campo direccion
    setForm(f => ({
      ...f,
      latlng: latlngObj,
      direccion: latlngObj.address ? latlngObj.address : f.direccion
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    if (!user || !user.dni) {
      setErrorMsg('Error: Usuario no autenticado o sin DNI');
      setLoading(false);
      return;
    }

    // Validar que se haya seleccionado una categoría y tipo
    if (!form.categoria) {
      setErrorMsg('Error: Debes seleccionar una categoría (Falta o Delito)');
      setLoading(false);
      return;
    }

    if (form.categoria === 'falta' && !form.cod_tipofalta) {
      setErrorMsg('Error: Debes seleccionar un tipo de falta específico');
      setLoading(false);
      return;
    }

    if (form.categoria === 'delito' && !form.cod_tipodelito) {
      setErrorMsg('Error: Debes seleccionar un tipo de delito específico');
      setLoading(false);
      return;
    }
    
    const reportData = {
      descripcion: form.descripcion,
      direccion: form.direccion,
      dni: user.dni,
      latitud: form.latlng?.lat || null,
      longitud: form.latlng?.lng || null,
      cod_tipofalta: form.categoria === 'falta' ? form.cod_tipofalta : null,
      cod_tipodelito: form.categoria === 'delito' ? form.cod_tipodelito : null
    };

    console.log('🔍 Estado del formulario:', {
      categoria: form.categoria,
      cod_tipofalta: form.cod_tipofalta,
      cod_tipodelito: form.cod_tipodelito
    });
    
    try {
      console.log('📤 Enviando datos de incidencia:', reportData);
      const response = await axios.post('/api/incidentes', reportData);
      console.log('📨 Respuesta del servidor:', response.data);
      
      if (response.data && response.data.success) {
        setSuccessMsg(`¡Incidencia registrada exitosamente! ID: ${response.data.codigo_incidente}`);
        setForm({ 
          descripcion: '', 
          direccion: '', 
          latlng: null,
          categoria: '',
          cod_tipofalta: '',
          cod_tipodelito: ''
        });
        
        // Llamar a onSubmit con los datos del reporte si está disponible
        if (onSubmit) {
          onSubmit({...reportData, codigo_incidente: response.data.codigo_incidente});
          return; // No cerrar automáticamente si hay onSubmit personalizado
        }
        
        // Comportamiento por defecto si no hay onSubmit personalizado
        setTimeout(() => {
          setSuccessMsg('');
        }, 3000);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error) {
      console.error('Error al registrar incidencia:', error);
      setErrorMsg(error.response?.data?.error || 'Error al registrar la incidencia. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {successMsg && (
        <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg">
          <div className="flex items-center">
            <i className="ri-check-line mr-2"></i>
            {successMsg}
          </div>
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <div className="flex items-center">
            <i className="ri-error-warning-line mr-2"></i>
            {errorMsg}
          </div>
        </div>
      )}

      {loadingTipos ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-800 font-medium">Cargando tipos de incidencia...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Categoría de Incidencia *
            </label>
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            >
              <option value="">Selecciona una categoría</option>
              <option value="falta">🟡 Falta - Infracciones menores</option>
              <option value="delito">🔴 Delito - Crímenes graves</option>
            </select>
          </div>

          {form.categoria === 'falta' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tipo de Falta *
              </label>
              <select
                name="cod_tipofalta"
                value={form.cod_tipofalta}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="">Selecciona un tipo de falta</option>
                {tipos.faltas.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.denominacion} - {tipo.descripcion}
                  </option>
                ))}
              </select>
            </div>
          )}

          {form.categoria === 'delito' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tipo de Delito *
              </label>
              <select
                name="cod_tipodelito"
                value={form.cod_tipodelito}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="">Selecciona un tipo de delito</option>
                {tipos.delitos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.denominacion} - {tipo.descripcion}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Dirección (referencia) *
            </label>
            <input
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
              placeholder="Ej: Av. Principal esquina con Jr. Los Olivos"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Descripción *
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Describe la situación de manera clara y concisa..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Ubicación en el mapa
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div style={{ height: 250 }}>
                <MapContainer center={[-13.1588, -74.2239]} zoom={14} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationSelector onSelect={handleMapSelect} value={form.latlng} />
                </MapContainer>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-800 font-medium">
              <i className="ri-information-line mr-1"></i>
              Haz clic en el mapa para seleccionar la ubicación exacta del incidente
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              <i className="ri-close-line mr-2"></i>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line mr-2 animate-spin"></i>
                  Registrando...
                </>
              ) : (
                <>
                  <i className="ri-send-plane-line mr-2"></i>
                  Registrar Incidencia
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default IncidentRegisterPanel;
