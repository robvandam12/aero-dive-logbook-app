
import { DiveLogsList } from "@/components/DiveLogsList";
import { PageHeader } from "@/components/PageHeader";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Suspense } from "react";

const AllDiveLogsPage = () => {
  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-4 mb-6 px-8 pt-8">
        <SidebarTrigger />
        <PageHeader title="Mis Bitácoras" />
      </div>
      <div className="px-8 pb-8">
        <Suspense fallback={<LoadingSkeleton type="table" count={5} />}>
          <DiveLogsList />
        </Suspense>
      </div>
    </div>
  );
};

export default AllDiveLogsPage;
