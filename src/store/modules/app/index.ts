import { defineStore } from "pinia";
import defaultSettings from "@/config/settings.json";
import { AppState } from "./types";

const useAppStore = defineStore("app", {
    state: (): AppState => ({ ...defaultSettings }),

    actions: {
        // Update app settings
        updateSettings(partial: Partial<AppState>) {
            // @ts-ignore-next-line
            this.$patch(partial);
        },
    },
});

export default useAppStore;
