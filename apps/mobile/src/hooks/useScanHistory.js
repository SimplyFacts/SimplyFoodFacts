import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDeviceHeaders } from "@/utils/deviceId";

// Fetch scan history
async function fetchScanHistory() {
  const headers = await getDeviceHeaders();
  const response = await fetch("/api/scan-history", { headers });
  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }
  return response.json();
}

// Clear scan history
async function clearScanHistory() {
  const headers = await getDeviceHeaders();
  const response = await fetch("/api/scan-history", {
    method: "DELETE",
    headers,
  });
  if (!response.ok) {
    throw new Error("Failed to clear history");
  }
  return response.json();
}

export function useScanHistory() {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["scanHistory"],
    queryFn: fetchScanHistory,
    staleTime: 1000 * 60, // 1 minute
  });

  const clearMutation = useMutation({
    mutationFn: clearScanHistory,
    onSuccess: () => {
      queryClient.setQueryData(["scanHistory"], []);
    },
  });

  return {
    history: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    error: historyQuery.error,
    clearHistory: clearMutation.mutate,
    isClearing: clearMutation.isPending,
  };
}
