
import { useState, useMemo } from 'react';
import { useDiveLogs } from '@/hooks/useDiveLogs';
import { useAuth } from '@/contexts/AuthProvider';

export interface SearchFilters {
  search: string;
  status: 'all' | 'draft' | 'signed';
  centerName: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy: 'date' | 'center' | 'status';
  sortOrder: 'asc' | 'desc';
}

const defaultFilters: SearchFilters = {
  search: '',
  status: 'all',
  centerName: 'all',
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useAdvancedSearch = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: diveLogsResponse, isLoading, error } = useDiveLogs({
    userId: user?.id,
    page: currentPage,
    perPage: 20,
    search: filters.search,
    status: filters.status,
    centerName: filters.centerName,
  });

  // Filter and sort results based on advanced criteria
  const filteredAndSortedLogs = useMemo(() => {
    if (!diveLogsResponse?.data) return [];

    let logs = [...diveLogsResponse.data];

    // Apply date filters
    if (filters.dateFrom) {
      logs = logs.filter(log => new Date(log.log_date) >= new Date(filters.dateFrom!));
    }
    if (filters.dateTo) {
      logs = logs.filter(log => new Date(log.log_date) <= new Date(filters.dateTo!));
    }

    // Apply sorting
    logs.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.log_date).getTime() - new Date(b.log_date).getTime();
          break;
        case 'center':
          comparison = (a.centers?.name || '').localeCompare(b.centers?.name || '');
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return logs;
  }, [diveLogsResponse?.data, filters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).some(key => {
      const filterKey = key as keyof SearchFilters;
      return filters[filterKey] !== defaultFilters[filterKey];
    });
  }, [filters]);

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
    logs: filteredAndSortedLogs,
    pagination: diveLogsResponse ? {
      currentPage: diveLogsResponse.currentPage,
      totalPages: diveLogsResponse.totalPages,
      hasNextPage: diveLogsResponse.hasNextPage,
      hasPreviousPage: diveLogsResponse.hasPreviousPage,
      count: diveLogsResponse.count,
    } : null,
    currentPage,
    setCurrentPage,
    isLoading,
    error,
  };
};
