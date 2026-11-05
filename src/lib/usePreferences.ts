"use client";

import * as React from "react";
import { DEFAULT_WEIGHTS, type Weights } from "@/lib/scoring";

/**
 * Deliberately anonymous.
 *
 * There is no name and no child age in here. A search area, some weightings
 * and a list of school ids cannot identify a family, which is the point: the
 * account page can say "not stored" and mean it.
 */
export interface Preferences {
  maxTravelMinutes: number;
  dropTime: string;
  pickupTime: string;
  weights: Weights;
  mustHaves: {
    montessori: boolean;
    cctvParentAccess: boolean;
    flexibleDaycare: boolean;
  };
  budgetBuckets: Array<"low" | "medium" | "high">;
  shortlisted: string[];
}

export const DEFAULT_PREFERENCES: Preferences = {
  maxTravelMinutes: 20,
  dropTime: "09:00",
  pickupTime: "13:00",
  weights: DEFAULT_WEIGHTS,
  mustHaves: {
    montessori: false,
    cctvParentAccess: false,
    flexibleDaycare: false,
  },
  budgetBuckets: ["low", "medium", "high"],
  shortlisted: [],
};

const STORAGE_KEY = "firststeps_preferences";

/**
 * Preferences live in the browser until there is an account to hang them on.
 * Reading happens after mount so the server and the first client render agree.
 */
export function usePreferences() {
  const [prefs, setPrefs] = React.useState<Preferences>(DEFAULT_PREFERENCES);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Preferences>;
        setPrefs({
          ...DEFAULT_PREFERENCES,
          ...parsed,
          weights: { ...DEFAULT_PREFERENCES.weights, ...parsed.weights },
          mustHaves: { ...DEFAULT_PREFERENCES.mustHaves, ...parsed.mustHaves },
        });
      }
    } catch {
      // A corrupt or blocked store is not worth breaking the page over.
    }
    setLoaded(true);
  }, []);

  const update = React.useCallback((patch: Partial<Preferences>) => {
    setPrefs((current) => {
      const next = { ...current, ...patch };
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore quota or privacy-mode failures.
      }
      return next;
    });
  }, []);

  const toggleShortlist = React.useCallback(
    (schoolId: string) => {
      setPrefs((current) => {
        const has = current.shortlisted.includes(schoolId);
        const next = {
          ...current,
          shortlisted: has
            ? current.shortlisted.filter((id) => id !== schoolId)
            : [...current.shortlisted, schoolId],
        };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore.
        }
        return next;
      });
    },
    []
  );

  return { prefs, update, toggleShortlist, loaded };
}
