import { Home, Columns3, CalendarCheck, SlidersHorizontal, User } from "lucide-react";

export const NAV_ITEMS = [
  { label: "Schools", short: "Schools", href: "/shortlist", icon: Home },
  { label: "Compare", short: "Compare", href: "/compare", icon: Columns3 },
  { label: "Visits", short: "Visits", href: "/visits", icon: CalendarCheck },
  { label: "My needs", short: "Needs", href: "/settings/needs", icon: SlidersHorizontal },
  { label: "Account", short: "Account", href: "/settings", icon: User },
] as const;
