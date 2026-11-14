import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Navigation, Filter, CheckCircle2, XCircle, Map as MapIcon, ChevronRight, Info, LayoutGrid } from 'lucide-react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapPage = () => {
  const [places, setPlaces] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [amenRes, placeRes] = await Promise.all([
          fetch('/api/amenities'),
          fetch('/api/places')
        ]);
        const amenData = await amenRes.json();
        const placeData = await placeRes.json();
        setAmenities(amenData);
        setPlaces(placeData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPlaces = filterType === 'all' 
    ? places 
    : places.filter(p => p.type === filterType);

  const distanceM = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const nearbyAmenities = amenities.filter(poi => {
    const type = poi.tags?.amenity;
    if (type !== 'toilets' && type !== 'pharmacy') return false;
    return places.some(p => distanceM(p.lat, p.lng, poi.lat, poi.lon) <= 400);
  });

  const renderStars = (score) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.round(score) ? 'text-warning fill-current' : 'text-slate-200'}`} />
    ));
  };

  const FeatureItem = ({ label, present, icon: Icon }) => (
    <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${present ? 'bg-emerald-50/30 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-black uppercase tracking-widest ${present ? 'text-emerald-700' : 'text-slate-400'}`}>{label}</span>
      </div>
      {present ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-300" />}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
      {/* Sidebar Panel */}
      <motion.div 
        initial={{ x: -400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-[420px] glass-panel z-20 flex flex-col h-[45%] md:h-full shadow-2xl relative"
      >
        <div className="p-6 border-b border-white/40 bg-white/40 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
              <MapIcon className="w-6 h-6 mr-3 text-primary" />
              Inclusion Lens
            </h2>
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              <LayoutGrid className="w-4 h-4" />
            </div>
          </div>
          
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select 
              className="w-full pl-12 pr-4 py-3.5 bg-white/80 border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary/20 focus:bg-white outline-none transition-all shadow-sm appearance-none cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Discover All Facilities</option>
              <option value="mall">Modern Malls</option>
              <option value="hospital">Healthcare Centers</option>
              <option value="transit">Metro & Rail Transit</option>
              <option value="bus stop">Public Bus Stops</option>
              <option value="public space">Parks & Public Spaces</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-4 h-4 text-slate-400 rotate-90" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <AnimatePresence mode="wait">
            {selectedPlace ? (
              <motion.div 
                key={selectedPlace.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-primary text-[10px] font-black rounded-lg text-white uppercase tracking-[0.2em]">
                      {selectedPlace.type}
                    </span>
                    {selectedPlace.is_verified && (
                      <span className="flex items-center px-3 py-1 bg-emerald-100 text-[10px] font-black rounded-lg text-emerald-700 uppercase tracking-[0.2em]">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                      </span>
                    )}
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 leading-tight mb-2">{selectedPlace.name}</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">{renderStars(selectedPlace.score)}</div>
                    <span className="text-xl font-black text-slate-900">{selectedPlace.score.toFixed(1)} <span className="text-sm text-slate-400 font-bold">/ 5</span></span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-4">
                    <h4 className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                      <Info className="w-3 h-3 mr-2" /> Structural Audit
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <FeatureItem label="Ramp Access" present={selectedPlace.ramp} />
                      <FeatureItem label="Elevator" present={selectedPlace.elevator} />
                      <FeatureItem label="Wide Entry" present={selectedPlace.wide_entrance} />
                      <FeatureItem label="Auto Doors" present={selectedPlace.automatic_doors} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                      <Info className="w-3 h-3 mr-2" /> Personal Assistance
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <FeatureItem label="Acc. Toilet" present={selectedPlace.accessible_toilet} />
                      <FeatureItem label="Handrails" present={selectedPlace.handrails} />
                      <FeatureItem label="Resting Area" present={selectedPlace.resting_area} />
                      <FeatureItem label="Parking" present={selectedPlace.accessible_parking} />
                      <FeatureItem label="Panic Alarm" present={selectedPlace.emergency_alarm} />
                      <FeatureItem label="Visual Aid" present={selectedPlace.visual_assistance} />
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.lat},${selectedPlace.lng}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full btn-primary bg-slate-900 hover:bg-slate-800 py-5 flex items-center justify-center gap-3 text-lg shadow-2xl shadow-slate-900/20"
                >
                  <Navigation className="w-6 h-6" />
                  Suggest Accessible Route
                </motion.button>

                <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-widest leading-relaxed">
                  Data sourced from civic audits and community reports. Last updated today.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-8 animate-bounce">
                  <MapIcon className="w-10 h-10 text-slate-300" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Select a POI</h4>
                <p className="text-sm font-medium text-slate-400 max-w-[200px] mx-auto">Click on a map marker to explore detailed accessibility compliance data.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Map Section */}
      <div className="flex-1 relative z-0">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Calibrating Inclusion Map...</p>
            </div>
          </div>
        )}
        <MapContainer center={[13.0827, 80.2707]} zoom={13} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredPlaces.map(place => {
            const getZoneColor = (score) => {
              if (score >= 4) return '#10B981';
              if (score >= 2.5) return '#F59E0B';
              return '#EF4444';
            };
            const zoneColor = getZoneColor(place.score);
            
            return (
              <React.Fragment key={place.id}>
                <Circle 
                  center={[place.lat, place.lng]} 
                  pathOptions={{ fillColor: zoneColor, color: zoneColor, weight: 1, fillOpacity: 0.12 }} 
                  radius={400}
                />
                <Marker 
                  position={[place.lat, place.lng]}
                  eventHandlers={{ click: () => setSelectedPlace(place) }}
                >
                  <Popup className="premium-popup">
                    <div className="p-1">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{place.type}</p>
                      <strong className="text-sm font-black block text-slate-900">{place.name}</strong>
                      <div className="mt-2 flex items-center justify-between gap-4">
                        <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded">SCORE: {place.score.toFixed(1)}</span>
                        <div className="flex gap-0.5">{renderStars(place.score)}</div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
          {nearbyAmenities.map(poi => {
            const isToilet = poi.tags.amenity === 'toilets';
            const isPharm = poi.tags.amenity === 'pharmacy';
            
            const iconHtml = isToilet 
              ? `<div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-xl text-xs transform hover:scale-125 transition-transform font-bold">🚻</div>`
              : isPharm
              ? `<div class="bg-rose-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-xl text-xs transform hover:scale-125 transition-transform font-bold">⚕️</div>`
              : `<div class="bg-amber-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-xl text-xs transform hover:scale-125 transition-transform font-bold">🚌</div>`;
            
            const customIcon = L.divIcon({
              html: iconHtml,
              className: 'bg-transparent',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            });

            return (
              <Marker key={poi.id} position={[poi.lat, poi.lon]} icon={customIcon}>
                <Popup>
                  <div className="p-1">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Service Amenity</p>
                    <strong className="text-sm font-black text-slate-900">{poi.tags.name || 'Public Facility'}</strong>
                    <p className="text-[10px] mt-1 font-bold text-primary uppercase">{poi.tags.amenity || poi.tags.highway}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
