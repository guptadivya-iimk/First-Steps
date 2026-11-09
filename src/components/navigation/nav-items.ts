import {
  Home,
  Columns3,
  CalendarCheck,
  SlidersHorizontal,
  User,
} from "lucide-react";

/**
 * Each destination owns a crayon, the way langmobile gives every menu item its
 * own small coloured icon. The colour fills solid when you are on that page.
 */
export const NAV_ITEMS = [
  { label: "Schools", short: "Schools", href: "/shortlist", icon: Home, crayon: "crayon-tangerine" },
  { label: "Compare", short: "Compare", href: "/compare", icon: Columns3, crayon: "crayon-lagoon" },
  { label: "Visits", short: "Visits", href: "/visits", icon: CalendarCheck, crayon: "crayon-forest" },
  { label: "My needs", short: "Needs", href: "/settings/needs", icon: SlidersHorizontal, crayon: "crayon-grape" },
  { label: "Account", short: "Account", href: "/settings", icon: User, crayon: "crayon-sunshine" },
] as const;
