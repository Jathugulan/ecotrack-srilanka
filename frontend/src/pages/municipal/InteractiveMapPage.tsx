import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import {
  Navigation,
  Route as RouteIcon,
  Sparkles,
  MapPin,
  Truck,
  CheckCircle2,
  Building2,
  Zap,
} from 'lucide-react';
import { api } from '../../api/client.js';
import { WasteReport } from '../../types.js';

// Custom Marker Icons
const redMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeMarker = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const InteractiveMapPage: React.FC = () => {
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports');
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching reports for map:', err);
    }
  };

  const handleOptimizeRoute = async () => {
    setOptimizing(true);
    try {
      const resTasks = await api.get('/collection-tasks');
      const taskIds = resTasks.data.data.map((t: any) => t._id);

      if (taskIds.length === 0) {
        alert('No active field tasks to optimize.');
        return;
      }

      const res = await api.post('/routes/optimize', {
        vehicleId: '6ac877d949449f1db1f13b28',
        taskIds,
      });

      if (res.data.success) {
        setOptimizedRoute(res.data.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error running route optimization algorithm.');
    } finally {
      setOptimizing(false);
    }
  };

  const centerCoordinates: [number, number] = [6.9271, 79.8612]; // Colombo Port / Fort center

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Colombo Municipal GIS Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
            Spatial Incident Map & Fleet Router
          </h1>
          <p className="text-[13px] text-[#46574F] dark:text-[#8FA196] mt-1">
            Real-time geospatial visualization of illegal dumping hot-spots, ward boundaries, and AI route paths.
          </p>
        </div>

        <button
          onClick={handleOptimizeRoute}
          disabled={optimizing}
          className="px-5 py-2.5 rounded-2xl bg-[#138A5B] hover:bg-[#0E734A] text-white font-bold text-[12px] shadow-lg shadow-[#138A5B]/25 flex items-center gap-2 transition-all hover:scale-[1.01] shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#B8F34A]" />
          <span>{optimizing ? 'Calculating TSP Trajectory...' : 'Optimize Collection Route (AI)'}</span>
        </button>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-xs">
          <span className="text-[11px] font-bold text-[#8FA196] uppercase">Active Hotspots</span>
          <p className="text-2xl font-black text-[#172B23] dark:text-[#F1F7F3] mt-1">{reports.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-xs">
          <span className="text-[11px] font-bold text-[#8FA196] uppercase">Wards Monitored</span>
          <p className="text-2xl font-black text-[#138A5B] dark:text-[#43D99A] mt-1">47 Wards</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-xs">
          <span className="text-[11px] font-bold text-[#8FA196] uppercase">Fleet Status</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">12 Trucks Active</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-xs">
          <span className="text-[11px] font-bold text-[#8FA196] uppercase">Est. Fuel Savings</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">~18.4%</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[620px] rounded-3xl overflow-hidden border border-[#DFE8E2] dark:border-[#293B31] shadow-xl relative">
        <MapContainer center={centerCoordinates} zoom={13} scrollWheelZoom={true} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {reports.map((report) => {
            const isResolved = report.status === 'RESOLVED';
            const isAssigned = report.status === 'ASSIGNED' || report.status === 'IN_PROGRESS';
            const markerIcon = isResolved ? greenMarker : isAssigned ? orangeMarker : redMarker;

            return (
              <Marker
                key={report._id}
                position={[report.location.coordinates[1], report.location.coordinates[0]]}
                icon={markerIcon}
              >
                <Popup>
                  <div className="p-1 font-sans">
                    <h4 className="font-extrabold text-[13px] text-[#172B23]">{report.referenceNumber}</h4>
                    <p className="text-[11px] text-[#46574F] mt-0.5">{report.address}</p>
                    <p className="text-[11px] font-bold text-[#138A5B] mt-1">Category: {report.category}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100">
                      Status: {report.status}
                    </span>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {optimizedRoute && optimizedRoute.waypoints && (
            <Polyline
              positions={optimizedRoute.waypoints.map((wp: any) => [
                wp.location.coordinates[1],
                wp.location.coordinates[0],
              ])}
              color="#138A5B"
              weight={5}
              opacity={0.85}
              dashArray="5, 10"
            />
          )}
        </MapContainer>

        {/* Floating Route Badge */}
        {optimizedRoute && (
          <div className="absolute top-4 right-4 z-[1000] p-4 rounded-2xl bg-white/95 dark:bg-[#141E19]/95 backdrop-blur-md border border-[#DFE8E2] dark:border-[#293B31] shadow-xl space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#138A5B] dark:text-[#43D99A] flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Optimized Route Trajectory</span>
            </span>
            <p className="text-[13px] font-extrabold text-[#172B23] dark:text-[#F1F7F3]">
              Distance: {optimizedRoute.totalDistanceKm} km
            </p>
            <p className="text-[11px] text-[#8FA196]">
              Waypoints: {optimizedRoute.waypoints?.length || 0} stops sequenced
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
