
import { DiveLogsList } from "@/components/DiveLogsList";
import { PageHeader } from "@/components/PageHeader";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Suspense } from "react";

const AllDiveLogsPage = () => {
  return (
    <main className="container mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <PageHeader title="Mis Bitácoras" />
      </div>
      <Suspense fallback={<LoadingSkeleton type="table" count={5} />}>
        <DiveLogsList />
      </Suspense>
    </main>
  );
};

export default AllDiveLogsPage;
