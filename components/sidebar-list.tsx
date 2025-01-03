import { clearChats, getChats } from "@/actions";
import { ClearHistory } from "@/components/clear-history";
import { SidebarItems } from "@/components/sidebar-items";
import { ThemeToggle } from "@/components/theme-toggle";
import { redirect } from "next/navigation";
import { cache } from "react";

interface SidebarListProps {
  userId?: string;
  siteId?: string;
  children?: React.ReactNode;
}

const loadChats = cache(async (userId?: string, siteId?: string) => {
  return await getChats(userId, siteId);
});

export async function SidebarList({ userId, siteId }: SidebarListProps) {
  const chats = await loadChats(userId, siteId);

  if (!chats || "error" in chats) {
    redirect("/");
  } else {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {chats?.length ? (
            <div className="space-y-2 px-2">
              <SidebarItems chats={chats} />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No chat history</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between p-4">
          <ThemeToggle />
          <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} />
        </div>
      </div>
    );
  }
}
