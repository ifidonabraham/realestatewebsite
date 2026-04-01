'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';

// Standard Leaflet Icon Fix
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Haversine formula to calculate distance in km
function calculateDistance(lat1, lon1, lat2, lng2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lng2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; // Distance in km
  return d;
}

export default function PropertyMap({ properties, radius = 50 }) {
  const [userLocation, setUserLocation] = useState([6.465422, 3.406448]); // Default Lagos

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => console.warn('Location access denied. Using default Lagos coordinates.')
    );
  }, []);

  // Filter properties based on distance from userLocation
  const nearbyProperties = properties.filter(p => {
    if (!p.lat || !p.lng) return false;
    const distance = calculateDistance(userLocation[0], userLocation[1], p.lat, p.lng);
    return distance <= radius;
  });

  return (
    <div className="h-[600px] w-full rounded-[48px] overflow-hidden shadow-2xl border-8 border-white relative group">
      {/* Visual Overlay for Count */}
      <div className="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-xl border border-neutral/5 flex items-center gap-3">
         <span className="text-xl">📍</span>
         <div>
            <p className="text-[10px] font-black text-neutral uppercase tracking-widest leading-none">Nearby Results</p>
            <p className="text-sm font-black text-primary-dark">{nearbyProperties.length} Properties within {radius}km</p>
         </div>
      </div>

      <MapContainer center={userLocation} zoom={11} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        <Circle 
          center={userLocation} 
          radius={radius * 1000} 
          pathOptions={{ fillColor: '#1E40AF', fillOpacity: 0.1, color: '#1E40AF', weight: 1, dashArray: '10, 10' }} 
        />
        
        <Marker position={userLocation}>
          <Popup>You are here</Popup>
        </Marker>

        {nearbyProperties.map(prop => (
          <Marker key={prop.id} position={[prop.lat, prop.lng]}>
            <Popup className="property-popup">
              <div className="w-48 space-y-3">
                <img src={prop.image} className="w-full h-24 object-cover rounded-xl shadow-md" alt="" />
                <div>
                  <h4 className="font-black text-primary-dark text-sm truncate leading-tight">{prop.title}</h4>
                  <p className="text-primary font-black text-lg">{prop.formattedPrice}</p>
                </div>
                <Link href={`/properties/${prop.id}`}>
                  <button className="w-full bg-primary text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">
                    View Property
                  </button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
