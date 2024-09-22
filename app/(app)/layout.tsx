import { SidebarProvider } from "@/hooks/use-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <SidebarProvider>{children}</SidebarProvider>;
}
