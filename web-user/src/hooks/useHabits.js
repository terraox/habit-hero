import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

// Fetch all habits
export const useHabits = () => {
  return useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      try {
        // Try to fetch real data
        // We use /api/habits/today or /api/habits depending on what we need.
        // Assuming /api/habits returns the full list with doneDates
        const data = await api.get("/api/habits");
        return data || [];
      } catch (e) {
        console.warn("Backend fetch failed", e);
        return [];
      }
    },
  });
};

// Toggle habit completion
export const useToggleHabit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      return await api.post(`/api/habits/${id}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["habits"]);
    },
  });
};
