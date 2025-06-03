import { tracingHeader } from "./constants";

export const getTracingKey = async () => {
  const result = await chrome.storage.local.get([tracingHeader]);
  return result[tracingHeader] ?? null;
};

export const updateTracingKey = async (value: string | null) => {
  await chrome.storage.local.set({ [tracingHeader]: value });
};
