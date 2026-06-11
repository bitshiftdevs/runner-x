import { create } from "zustand";
import type { Job, JobCategory, UrgencyLevel } from "@/types";

type QuestFilters = {
  category: JobCategory | null;
  urgency: UrgencyLevel | null;
  maxDistance: number | null;
};

type QuestState = {
  quests: Job[];
  activeQuest: Job | null;
  filters: QuestFilters;
  isLoading: boolean;
  setQuests: (quests: Job[]) => void;
  setActiveQuest: (quest: Job | null) => void;
  setFilters: (filters: Partial<QuestFilters>) => void;
  setLoading: (loading: boolean) => void;
  addQuest: (quest: Job) => void;
  updateQuest: (id: string, data: Partial<Job>) => void;
};

export const useQuestStore = create<QuestState>((set) => ({
  quests: [],
  activeQuest: null,
  filters: { category: null, urgency: null, maxDistance: null },
  isLoading: false,
  setQuests: (quests) => set({ quests }),
  setActiveQuest: (activeQuest) => set({ activeQuest }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setLoading: (isLoading) => set({ isLoading }),
  addQuest: (quest) => set((state) => ({ quests: [quest, ...state.quests] })),
  updateQuest: (id, data) =>
    set((state) => ({
      quests: state.quests.map((q) => (q.id === id ? { ...q, ...data } : q)),
    })),
}));
