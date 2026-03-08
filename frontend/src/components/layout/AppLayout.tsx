import { Outlet } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

function BaseLayout({ withSidebar }: { withSidebar: boolean }) {
  return (
    <div className="min-h-screen bg-background md:flex">
      {withSidebar ? <Sidebar /> : null}
      <div className="flex min-h-screen flex-1 flex-col">
        <Header />
        <main className={`flex-1 ${withSidebar ? "p-5 md:p-7" : "p-5 md:p-8"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AppLayout() {
  return <BaseLayout withSidebar />;
}

export function AppLayoutNoSidebar() {
  return <BaseLayout withSidebar={false} />;
}
