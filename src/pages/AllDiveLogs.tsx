
import { Header } from "@/components/Header";
import { DiveLogsList } from "@/components/DiveLogsList";

const AllDiveLogsPage = () => {
  return (
    <div className="min-h-screen bg-hero-gradient ocean-pattern">
      <Header />
      <main className="container mx-auto px-6 py-8 space-y-8">
        <DiveLogsList />
      </main>
    </div>
  );
};

export default AllDiveLogsPage;
