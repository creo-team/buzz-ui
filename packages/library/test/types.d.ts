declare global {
	var __hotkeyCallbacks: Map<string, { callback: (event: any) => void, options?: any }> | undefined
	function triggerHotkey(key: string): void
	function setClassState(className: string, hasClass: boolean): void
	function setAttribute(name: string, value: string): void
}

export {}
