import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import "./TourMap.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function TourMap({ locations }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/s-chanda/clikoaxwo00fq01pf9h3lgc0g",
      scrollZoom: false,
    });

    const bounds = new mapboxgl.LngLatBounds();
    locations.forEach((loc) => {
      // create marker
      const el = document.createElement("div");
      el.className = "marker";

      // add marker
      new mapboxgl.Marker({ element: el, anchor: "bottom" })
        .setLngLat(loc.coordinates)
        .addTo(map.current);

      // add popup
      new mapboxgl.Popup({ offset: 30 })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map.current);

      // extend map bounds to include current location
      bounds.extend(loc.coordinates);
    });

    map.current.fitBounds(bounds, {
      padding: { top: 200, bottom: 150, left: 100, right: 100 },
    });
  });

  return (
    <section className="section-map">
      <div ref={mapContainer} id="map"></div>
    </section>
  );
}
