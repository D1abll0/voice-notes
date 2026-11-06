import { create } from 'zustand'
import type { Device } from '../ai/protocol'

interface AiState
{
	status: 'idle' | 'loading' | 'ready' | 'error',
	progress: { speech: number, search: number },
	device: Device | null,
	error: string | null
};

export const useAiStore = create<AiState>()(() =>
({
	status: 'idle',
	progress: { speech: 0, search: 0 },
	device: null,
	error: null
}));