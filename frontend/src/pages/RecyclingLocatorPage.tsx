import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Phone,
  Clock,
  Search,
  Navigation,
  Recycle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { api } from '../api/client.js';
import { RecyclingCenter } from '../types.js';

// Custom Leaflet Green Pin Icon
const greenPinIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const RecyclingLocatorPage: React.FC = () => {
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [filterMaterial, setFilterMaterial] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCenters();
  }, [filterMaterial, searchTerm]);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filterMaterial !== 'ALL') params.material = filterMaterial;
      if (searchTerm) params.search = searchTerm;

      const res = await api.get('/recycling-centers', { params });
      if (res.data.success) {
        setCenters(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching centers:', err);
    } finally {
      setLoading(false);
    }
  };

  const centerCoordinates: [number, number] = [6.9015, 79.8712]; // Colombo center

  const materialTags = ['ALL', 'PLASTIC', 'PAPER', 'METAL', 'GLASS', 'E_WASTE'];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#172B23] dark:text-[#F1F7F3] transition-colors">
      
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF5EE] dark:bg-[#1B2922] border border-[#DFE8E2] dark:border-[#293B31] text-[11px] font-bold text-[#138A5B] dark:text-[#43D99A] mb-3">
          <Recycle className="w-3.5 h-3.5" />
          <span>Circular Economy Aggregator Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B23] dark:text-[#F1F7F3] tracking-tight">
          Recycling Center Locator
        </h1>
        <p className="mt-2 text-[14px] text-[#46574F] dark:text-[#8FA196]">
          Locate certified drop-off points, buy-back depots, and CEA-accredited recyclers across Sri Lanka.
        </p>

        {/* Toolbar */}
        <div className="mt-6 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 text-[#8FA196] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by depot name, area, or street..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DFE8E2] dark:border-[#293B31] bg-white dark:bg-[#141E19] text-[13px] text-[#172B23] dark:text-[#F1F7F3] placeholder:text-[#8FA196] focus:outline-none focus:ring-2 focus:ring-[#138A5B] dark:focus:ring-[#43D99A] transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[12px]">
            {materialTags.map((mat) => (
              <button
                key={mat}
                onClick={() => setFilterMaterial(mat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                  filterMaterial === mat
                    ? 'bg-[#138A5B] text-white shadow-md shadow-[#138A5B]/20'
                    : 'bg-white dark:bg-[#141E19] text-[#46574F] dark:text-[#C1CEC5] border border-[#DFE8E2] dark:border-[#293B31] hover:bg-[#EAF5EE]'
                }`}
              >
                {mat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split Layout: Map & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px]">
        {/* Leaflet Map Column */}
        <div className="lg:col-span-7 h-full rounded-3xl overflow-hidden border border-[#DFE8E2] dark:border-[#293B31] shadow-xl relative">
          <MapContainer center={centerCoordinates} zoom={12} scrollWheelZoom={true} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {centers.map((center) => (
              <Marker
                key={center._id}
                position={[center.location.coordinates[1], center.location.coordinates[0]]}
                icon={greenPinIcon}
              >
                <Popup>
                  <div className="p-1 font-sans">
                    <h4 className="font-extrabold text-[13px] text-[#172B23]">{center.name}</h4>
                    <p className="text-[11px] text-[#46574F] mt-0.5">{center.address}</p>
                    <p className="text-[11px] text-[#138A5B] font-bold mt-1">
                      Accepts: {center.acceptedMaterials.join(', ')}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Centers Cards List */}
        <div className="lg:col-span-5 h-full overflow-y-auto space-y-3.5 pr-1">
          {centers.length === 0 ? (
            <div className="p-10 text-center rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31]">
              <Recycle className="w-10 h-10 text-[#8FA196] mx-auto mb-2" />
              <p className="text-[14px] font-bold text-[#172B23] dark:text-[#F1F7F3]">No depots found</p>
              <p className="text-[12px] text-[#46574F] dark:text-[#8FA196] mt-1">Try selecting "ALL" materials or clearing your search term.</p>
            </div>
          ) : (
            centers.map((center) => (
              <div
                key={center._id}
                className="p-5 rounded-3xl bg-white dark:bg-[#141E19] border border-[#DFE8E2] dark:border-[#293B31] shadow-md hover:border-[#138A5B] dark:hover:border-[#43D99A] transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-extrabold text-[#172B23] dark:text-[#F1F7F3] group-hover:text-[#138A5B] dark:group-hover:text-[#43D99A] transition-colors">
                    {center.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF5EE] dark:bg-[#1B2922] text-[#138A5B] dark:text-[#43D99A] border border-[#DFE8E2] dark:border-[#293B31] shrink-0">
                    Verified Depot
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-[12px] text-[#46574F] dark:text-[#C1CEC5]">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A] shrink-0" />
                    <span>{center.address}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A] shrink-0" />
                    <span>{center.openingHours}</span>
                  </p>

                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#138A5B] dark:text-[#43D99A] shrink-0" />
                    <span>{center.contactDetails.phone}</span>
                  </p>
                </div>

                {/* Accepted Material Pills */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {center.acceptedMaterials.map((mat) => (
                    <span
                      key={mat}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F0F5F2] dark:bg-[#1B2922] text-[#172B23] dark:text-[#F1F7F3] border border-[#DFE8E2] dark:border-[#293B31]"
                    >
                      {mat}
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <div className="mt-4 pt-3 border-t border-[#DFE8E2] dark:border-[#293B31] flex items-center justify-between">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${center.location.coordinates[1]},${center.location.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#138A5B] dark:text-[#43D99A] hover:underline"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                  </a>

                  <a
                    href={`tel:${center.contactDetails.phone}`}
                    className="text-[12px] font-semibold text-[#46574F] dark:text-[#8FA196] hover:text-[#138A5B]"
                  >
                    Call Center
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
