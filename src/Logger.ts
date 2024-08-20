export type Logger = {
	info: (step: string, ctx: unknown) => void;
	warn: (step: string, ctx: unknown) => void;
	fatal: (step: string, ctx: unknown) => void;
};
