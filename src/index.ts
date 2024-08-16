import * as z from "zod";
// Máquina de estado
/**
 * 1 - Devara somente executar os steps
 * 2 - Cada step recebera o contexto, logger e body
 * 3 - Cada step retornara o próximo step e verificará se o mesmo deve ser executado internamente(automaticamente)
 * 4 - O retorno de todo contera: retorno da funcao, erro, próximo step.
 * 5 - Caso o próximo step seja NULL,
 */

// COisas nao cobertas
/**
 * 1 - os paths nao estao sendo registrados
 * 2 - Caso nao tenha corpo, nao precisamos passar o zod.schema, torne possivel ser null
 */

const schema = z.object({
	foo: z.string(),
});
type StepFunctionReturn<ExpectedReturnSchema extends z.ZodSchema> =
	| {
			error: string;
			response: null;
			path: null;
	  }
	| {
			error: null;
			response: z.infer<ExpectedReturnSchema>;
			path: null;
	  }
	| {
			error: null;
			response: null;
			path: string;
	  };
type StepFunction<Context, Logger, ExpectedReturnSchema extends z.ZodSchema> = (
	props: { context: Context },
	logger: Logger,
) => StepFunctionReturn<ExpectedReturnSchema>;
type Logger = {
	info: () => void;
	warn: () => void;
};

type StateMachine = <Steps, Context>(
	logger: Logger,
) => {
	register: <
		StepName extends Steps = Steps,
		ExpectedReturnSchema extends z.ZodSchema = z.ZodSchema,
		ExpectedBodySchema extends z.ZodSchema = z.ZodSchema,
	>(props: {
		step: StepFunction<Context, Logger, ExpectedReturnSchema>;
		name: StepName;
		nextStep: Exclude<Steps, StepName> | null;
		expectedReturnSchema: ExpectedReturnSchema;
		expectedBodySchema: ExpectedBodySchema;
		isInternal: boolean;
	}) => void;
	run: (ctx: Context) => Promise<void>;
};

const stateMachine: StateMachine = () => {
	return {
		register({ name }) {},
		async run(ctx) {},
	};
};

type Steps = "FIRST" | "TWO";
type Context = {
	foo: "";
	bar: "";
};

const logger: Logger = {
	info() {
		return;
	},
	warn() {
		return;
	},
};
const stateMachineInstance = stateMachine<Steps, Context>(logger);

// Entrypoint
const firstSchemaBody = z.object({
	first: z.boolean(),
});
const firstSchemaReturn = z.object({
	firstReturn: z.boolean(),
});

stateMachineInstance.register({
	expectedBodySchema: firstSchemaBody,
	expectedReturnSchema: firstSchemaReturn,
	name: "FIRST",
	nextStep: "TWO",
	isInternal: false,
	step: () => ({ error: null, response: { firstReturn: true }, path: null }),
});

const secondSchemaBody = z.object({
	second: z.boolean(),
});
const secondSchemaReturn = z.object({
	secondReturn: z.boolean(),
});
stateMachineInstance.register({
	expectedBodySchema: secondSchemaBody,
	expectedReturnSchema: secondSchemaReturn,
	name: "TWO",
	nextStep: null,
	step: () => ({ error: null, response: { foo: "Last!" }, path: null }),
	isInternal: true,
});
