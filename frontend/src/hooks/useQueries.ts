import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Match } from '../backend';

export function useMatches() {
  const { actor, isFetching } = useActor();

  return useQuery<Match[]>({
    queryKey: ['matches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMatches();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
