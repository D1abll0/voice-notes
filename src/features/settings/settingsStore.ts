import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface IVoiceSettings
{
	startRms: number,
	silenceMs: number,
	minSpeechMs: number,
	maxSpeechMs: number,
};


export const DEFAULT_SETTINGS: IVoiceSettings =
{
	startRms: 0.02,
	silenceMs: 900,
	minSpeechMs: 400,
	maxSpeechMs: 15_000,
};

interface ISettingsState extends IVoiceSettings
{
	update: (key: keyof IVoiceSettings, value: number) => void,
	reset: () => void
};

export const useSettings = create<ISettingsState>()(
	persist(
		set => ({
			...DEFAULT_SETTINGS,
			update: (key, value) => set({ [key]: value } as Partial<IVoiceSettings>),
			reset: () => set(DEFAULT_SETTINGS),
		}),
		{ name: 'private-voice-notes:settings' },
	),
);