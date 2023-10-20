import { Command, program } from "commander";
import { logger } from "@utils/logger";

export abstract class BaseCommand<TArgs extends any[] = [], TOption extends Record<string, string> = {}> {
    protected readonly name: string;
    protected readonly description: string;

    protected constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    protected abstract configure(p: Command): Command;
    protected abstract action(...args: [...TArgs, options: TOption]): Promise<void>;

    public initialize(): void {
        this.configure(program.command(this.name).description(this.description)).action((...args) => {
            this.action.call(this, ...(args as [...TArgs, options: TOption])).catch(e => {
                logger.error(`Error occurred during execution!`);
                console.error(e);
            });
        });
    }
}
