import * as React from "react";
import { FactStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Globe,
  AlertTriangle,
  HelpCircle,
  Clock,
} from "lucide-react";

type Variant = React.ComponentProps<typeof Badge>["variant"];

const MAP: Record<
  FactStatus,
  { label: string; variant: Variant; Icon: typeof CheckCircle2 }
> = {
  confirmed: { label: "School confirmed", variant: "default", Icon: CheckCircle2 },
  website: { label: "School website", variant: "website", Icon: Globe },
  listing: { label: "Listing site", variant: "warn", Icon: Clock },
  conflicting: { label: "Sources disagree", variant: "warn", Icon: AlertTriangle },
  old: { label: "Might be old", variant: "warn", Icon: Clock },
  unknown: { label: "Worth asking", variant: "ask", Icon: HelpCircle },
};

export function StatusTag({
  status,
  customText,
  className,
}: {
  status: FactStatus;
  customText?: string;
  className?: string;
}) {
  const { label, variant, Icon } = MAP[status] ?? MAP.unknown;

  return (
    <Badge variant={variant} className={className}>
      <Icon />
      <span>{customText || label}</span>
    </Badge>
  );
}
