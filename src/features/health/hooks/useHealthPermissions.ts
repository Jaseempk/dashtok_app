import { useState, useCallback, useEffect } from 'react';
import { healthService } from '../services/healthService';
import type { HealthPermissionResult, HealthPermissionStatus } from '../types/health.types';

interface UseHealthPermissionsResult {
  status: HealthPermissionStatus;
  permissions: HealthPermissionResult['permissions'];
  isLoading: boolean;
  isAvailable: boolean;
  request: () => Promise<HealthPermissionResult>;
  check: () => Promise<HealthPermissionResult>;
}

export function useHealthPermissions(): UseHealthPermissionsResult {
  const [status, setStatus] = useState<HealthPermissionStatus>('not_determined');
  const [permissions, setPermissions] = useState<HealthPermissionResult['permissions']>({
    steps: false,
    distance: false,
    workouts: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  // Check availability and permissions on mount
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const available = await healthService.isAvailable();
        setIsAvailable(available);

        if (available) {
          const result = await healthService.checkPermissions();
          setStatus(result.status);
          setPermissions(result.permissions);
        } else {
          setStatus('unavailable');
        }
      } catch (error) {
        console.error('[useHealthPermissions] Init error:', error);
        setStatus('unavailable');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const check = useCallback(async (): Promise<HealthPermissionResult> => {
    setIsLoading(true);
    try {
      const result = await healthService.checkPermissions();
      setStatus(result.status);
      setPermissions(result.permissions);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const request = useCallback(async (): Promise<HealthPermissionResult> => {
    setIsLoading(true);
    try {
      const result = await healthService.requestPermissions();
      setStatus(result.status);
      setPermissions(result.permissions);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    status,
    permissions,
    isLoading,
    isAvailable,
    request,
    check,
  };
}
