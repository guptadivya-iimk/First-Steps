"use client";

import * as React from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { CRAYON_HEX, crayonFor } from "@/lib/schoolIdentity";

export interface MapSchool {
  id: string;
  name: string;
  sector: string;
  score: number;
  lat: number;
  lng: number;
}

/**
 * The Atlas.
 *
 * Leaflet is loaded in the browser only, on first paint of this component, so
 * it never reaches the server bundle. Tiles come straight from OpenStreetMap,
 * which needs no key, and a CSS filter mutes them so our own pins carry the
 * colour rather than competing with the roads.
 */
export function SchoolMap({
  schools,
  home,
  selectedId,
  onSelect,
  className,
}: {
  schools: MapSchool[];
  home: { lat: number; lng: number };
  selectedId?: string | null;
  onSelect: (id: string) => void;
  className?: string;
}) {
  const holder = React.useRef<HTMLDivElement>(null);
  const map = React.useRef<LeafletMap | null>(null);
  const markers = React.useRef<Record<string, Marker>>({});
  const cleanup = React.useRef<(() => void) | null>(null);
  const onSelectRef = React.useRef(onSelect);
  const [ready, setReady] = React.useState(false);

  onSelectRef.current = onSelect;

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !holder.current || map.current) return;

      const instance = L.map(holder.current, {
        center: [home.lat, home.lng],
        zoom: 14,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        className: "firststeps-tiles",
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(instance);

      // Home sits under the school pins, as a soft ring rather than a marker.
      L.circleMarker([home.lat, home.lng], {
        radius: 9,
        color: "#17343a",
        weight: 2,
        fillColor: "#ffffff",
        fillOpacity: 1,
      })
        .addTo(instance)
        .bindTooltip("You are here", { direction: "top", offset: [0, -8] });

      for (const school of schools) {
        const hex = CRAYON_HEX[crayonFor(school.id)];
        const icon = L.divIcon({
          className: "firststeps-pin",
          html: `<span class="firststeps-pin-shape" style="--pin:${hex}">
                   <span class="firststeps-pin-score">${Math.round(school.score)}</span>
                 </span>`,
          iconSize: [38, 46],
          iconAnchor: [19, 44],
          popupAnchor: [0, -40],
        });

        const marker = L.marker([school.lat, school.lng], {
          icon,
          title: school.name,
          keyboard: true,
          alt: `${school.name}, ${school.sector}`,
        })
          .addTo(instance)
          .on("click", () => onSelectRef.current(school.id));

        markers.current[school.id] = marker;
      }

      const all = L.latLngBounds([
        [home.lat, home.lng],
        ...schools.map((s) => [s.lat, s.lng] as [number, number]),
      ]);
      instance.fitBounds(all, { padding: [48, 48] });

      const resize = new ResizeObserver(() => instance.invalidateSize());
      resize.observe(holder.current);
      cleanup.current = () => resize.disconnect();

      // One more pass after the first paint settles the tile grid.
      window.setTimeout(() => instance.invalidateSize(), 120);

      map.current = instance;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      cleanup.current?.();
      map.current?.remove();
      map.current = null;
      markers.current = {};
    };
    // Pins are built once from the full seed list; selection is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the chosen pin on top and centred.
  React.useEffect(() => {
    if (!ready) return;
    for (const [id, marker] of Object.entries(markers.current)) {
      const el = marker.getElement();
      if (el) el.classList.toggle("is-selected", id === selectedId);
    }
    if (selectedId && markers.current[selectedId] && map.current) {
      map.current.panTo(markers.current[selectedId].getLatLng(), {
        animate: true,
      });
    }
  }, [selectedId, ready]);

  return (
    <div
      ref={holder}
      role="application"
      aria-label="Map of preschools near Sector 47"
      className={cn(
        "h-full w-full overflow-hidden rounded-[var(--radius-card)] bg-paper-deep",
        className
      )}
    />
  );
}
