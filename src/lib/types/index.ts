export type FactSourceType =
  | "school_reply"
  | "school_website"
  | "listing_site"
  | "visit"
  | "parent_report";

export type FactStatus =
  | "confirmed"
  | "website"
  | "listing"
  | "conflicting"
  | "old"
  | "unknown";

export interface FactSource {
  type: FactSourceType;
  url?: string;
  name: string;
  quote?: string;
  capturedAt: string;
  capturedBy?: string;
}

export interface SchoolFact {
  key: string;
  value: any;
  displayText: string;
  sources: FactSource[];
  status: FactStatus;
  confidence: number;
  lastVerifiedAt?: string;
  conflictNote?: string;
}

export interface SchoolContact {
  type: "phone" | "whatsapp" | "email";
  value: string;
  label?: string;
  source: string;
  verifiedAt?: string;
}

export interface School {
  id: string;
  name: string;
  brand?: string;
  branchName?: string;
  address: string;
  sector: string;
  city: string;
  areaIds: string[];
  location: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  website?: string;
  googleMapsUrl?: string;
  contacts: SchoolContact[];
  status: "active" | "unverified" | "possibly_closed";
  facts: Record<string, SchoolFact>;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceArea {
  id: string;
  name: string;
  city: string;
  state: string;
  center: {
    lat: number;
    lng: number;
  };
  radiusKm: number;
  active: boolean;
  feeThresholds: {
    lowMax: number;
    mediumMax: number;
  };
  benchmarks: {
    preschoolMedianPerYear: number;
    daycareMonthlyMin: number;
    daycareMonthlyMax: number;
  };
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: "parent" | "admin";
  consentAcceptedAt?: string;
  homeAreaId: string;
  child?: {
    firstName?: string;
    ageMonthsAtJoining: number;
    joiningMonth: string;
    notes?: string;
  };
  preferences?: {
    home: {
      label: string;
      lat: number;
      lng: number;
      placeId?: string;
    };
    maxTravelMinutes: number;
    dropTime: string;
    pickupTime: string;
    mustHaves: {
      montessori: boolean;
      cctvParentAccess: boolean;
      flexibleDaycare: boolean;
    };
    daycarePlan: {
      startUntil: string;
      laterUpTo: string;
    };
    weights: {
      montessori: number;
      safety: number;
      daycare: number;
      travel: number;
      fees: number;
    };
    budgetBuckets: Array<"low" | "medium" | "high">;
  };
}
