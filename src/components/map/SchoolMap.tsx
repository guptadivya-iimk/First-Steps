"use client";

import * as React from "react";
import type { Map as LeafletMap, Marker, LayerGroup } from "leaflet";
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
 * Leaflet is loaded in the browser only, so it never reaches the server
 * bundle. Tiles come from OpenStreetMap, which needs no key, and a CSS filter
 * mutes them so our pins carry the colour rather than competing with roads.
 *
 * The map is built once, but its pins follow the `schools` prop: when the
 * parent filters the list, the pins that no longer match leave the map and
 * the view refits to what is left. A list and a map that disagree about which
 * schools are in play would be worse than no map.
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
  const layer = React.useRef<LayerGroup | null>(null);
  const markers = React.useRef<Record<string, Marker>>({});
  const leaflet = React.useRef<typeof import("leaflet") | null>(null);
  const cleanup = React.useRef<(() => void) | null>(null);
  const onSelectRef = React.useRef(onSelect);
  const [ready, setReady] = React.useState(false);

  onSelectRef.current = onSelect;

  // ---- Build the map once. ----
  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !holder.current || map.current) return;
      leaflet.current = L;

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

      // Home sits under the school pins as a soft ring rather than a marker.
      L.circleMarker([home.lat, home.lng], {
        radius: 9,
        color: "#191816",
        weight: 2.5,
        fillColor: "#ffffff",
        fillOpacity: 1,
      })
        .addTo(instance)
        .bindTooltip("You are here", { direction: "top", offset: [0, -8] });

      layer.current = L.layerGroup().addTo(instance);

      const resize = new ResizeObserver(() => instance.invalidateSize());
      resize.observe(holder.current);
      cleanup.current = () => resize.disconnect();
      window.setTimeout(() => instance.invalidateSize(), 120);

      map.current = instance;
      setReady(true);
    })();

    return () => {
      cancelled = true;
      cleanup.current?.();
      map.current?.remove();
      map.current = null;
      layer.current = null;
      markers.current = {};
    };
    // The map itself is built once; pins are synced by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Keep the pins in step with the list. ----
  const signature = schools
    .map((s) => `${s.id}:${Math.round(s.score)}`)
    .join("|");

  React.useEffect(() => {
    const L = leaflet.current;
    if (!ready || !L || !map.current || !layer.current) return;

    layer.current.clearLayers();
    markers.current = {};

    for (const school of schools) {
      const hex = CRAYON_HEX[crayonFor(school.id)];
      const icon = L.divIcon({
        className: "firststeps-pin",
        html: `<span class="firststeps-pin-shape" style="--pin:${hex}">
                 <span class="firststeps-pin-score">${Math.round(school.score)}</span>
               </span>`,
        iconSize: [38, 46],
        iconAnchor: [19, 44],
      });

      const marker = L.marker([school.lat, school.lng], {
        icon,
        title: school.name,
        keyboard: true,
        alt: `${school.name}, ${school.sector}`,
      }).on("click", () => onSelectRef.current(school.id));

      layer.current.addLayer(marker);
      markers.current[school.id] = marker;
    }

    const bounds = L.latLngBounds([
      [home.lat, home.lng],
      ...schools.map((s) => [s.lat, s.lng] as [number, number]),
    ]);
    map.current.fitBounds(bounds, { padding: [56, 56], maxZoom: 15 });
    // `signature` captures every change to the pin set that matters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, signature]);

  // ---- Raise and centre the chosen pin. ----
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
  }, [selectedId, ready, signature]);

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
