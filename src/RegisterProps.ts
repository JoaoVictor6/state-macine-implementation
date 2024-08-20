import { z } from "zod";
import { Logger } from "./Logger.js";

type StepFunctionReturn<
	ExpectedReturnSchema extends z.ZodSchema<unknown>,
	PossibleNextSteps,
> =
	| {
			error: string;
			response: null;
			nextStep: PossibleNextSteps;
	  }
	| {
			error: null;
			response: z.infer<ExpectedReturnSchema>;
			nextStep: PossibleNextSteps;
	  };

type StepFunction<
	Context,
	Logger,
	ExpectedReturnSchema extends z.ZodSchema,
	PossibleNextSteps,
> = (
	props: Context,
	logger: Logger,
) => Promise<StepFunctionReturn<ExpectedReturnSchema, PossibleNextSteps>>;

export type RegisterProps<
	Steps,
	CurrentStep,
	Context,
	ExpectedReturnSchema extends z.ZodSchema,
	ExpectedBodySchema extends z.ZodSchema,
> = {
	step: StepFunction<
		Context,
		Logger,
		ExpectedReturnSchema,
		Exclude<Steps, CurrentStep> | null
	>;
	name: CurrentStep;
	expectedReturnSchema: ExpectedReturnSchema | null;
	expectedBodySchema: ExpectedBodySchema | null;
	isInternal: boolean;
};
