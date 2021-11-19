import { definitions } from "./supabase";

export type eventWithLocation = Partial<definitions["events"]> & {
  id: string;
  location?: {
    id: string;
    name: string;
  };
};

export type eventUpdateWithData = definitions["event_updates"] & {
  changes: Partial<definitions["events"]>;
};
