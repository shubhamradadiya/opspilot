// ============================================================================
// IMPORTS
// ============================================================================
import { useState, useEffect } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { API_ROUTES } from '@/utils/routes';

// ============================================================================
// TYPE — matches backend country response
// ============================================================================
export interface ICountry {
  id: number;
  name: string;
  officialName: string;
  flagPng: string;
  flagSvg: string;
  isoCode: string;
  isoCode3: string;
  phoneCode: string;
  suffixes: string;
}

interface CountriesResponse {
  statusCode: number;
  message: string;
  data: ICountry[];
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Fetches the country list from /api/v1/country and memoizes the result.
 * Returns { countries, loading, error }.
 */
let _cache: ICountry[] | null = null;

export const useCountries = () => {
  const [countries, setCountries] = useState<ICountry[]>(_cache ?? []);
  const [loading, setLoading] = useState<boolean>(!_cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Serve from in-memory cache if already fetched this session
    if (_cache) {
      setCountries(_cache);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    axiosInstance
      .get<CountriesResponse>(API_ROUTES.ADMIN.COUNTRIES)
      .then((res) => {
        if (cancelled) return;
        const data = (res.data as unknown as CountriesResponse).data ?? [];
        _cache = data;
        setCountries(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Failed to load countries';
        setError(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { countries, loading, error };
};
