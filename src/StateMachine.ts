import { z } from "zod";
import { Logger } from "./Logger.js";
import { RegisterProps } from "./RegisterProps.js";

export type StateMachineContextFactory<Steps, Object extends object> = {
	currentStep: Steps;
} & Object;
export type StateMachine = <
	Steps extends string,
	Context extends { currentStep: Steps },
	ExpectedReturnSchema extends z.ZodSchema,
	ExpectedBodySchema extends z.ZodSchema,
>(
	logger: Logger,
) => {
	register: <StepName extends string = Steps>(
		props: RegisterProps<
			Steps,
			StepName,
			Context,
			ExpectedReturnSchema,
			ExpectedBodySchema
		>,
	) => void;
	run: (ctx: Context) => Promise<{
		error: null | z.ZodError<unknown> | string;
		data: z.ZodSchema | null;
	}>;
};
