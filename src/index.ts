// Máquina de estado
/**
 * 1 - Devara somente executar os steps
 * 2 - Cada step recebera o contexto, logger e body
 * 3 - Cada step retornara o próximo step e verificará se o mesmo deve ser executado internamente(automaticamente)
 * 4 - O retorno de todo contera: retorno da funcao, erro, próximo step.
 * 5 - Caso o próximo step seja NULL,
 */

type MachineStateSteps = "INITIATE";
