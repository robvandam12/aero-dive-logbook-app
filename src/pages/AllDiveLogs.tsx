
import { DiveLogsList } from "@/components/DiveLogsList";
import { PageHeader } from "@/components/PageHeader";

const AllDiveLogsPage = () => {
  return (
    <main className="container mx-auto px-6 py-8 space-y-8">
      <PageHeader title="Mis Bitácoras" />
      <DiveLogsList />
    </main>
  );
};

export default AllDiveLogsPage;
