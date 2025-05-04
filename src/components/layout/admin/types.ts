
import { LucideIcon } from 'lucide-react';

export interface AdminRouteType {
  value: string;
  label: string;
  icon: LucideIcon;
  mobileVisibility?: 'always' | 'menu-only' | 'desktop-only';
  priority?: number; // Higher numbers will be shown first on mobile
}
