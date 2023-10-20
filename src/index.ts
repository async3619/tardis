import { program } from "commander";

import { PackageCommand } from "@commands/package";

async function main() {
    program.name("tardis").version("0.0.0");

    const commands = [new PackageCommand()];
    for (const command of commands) {
        command.initialize();
    }

    program.parse(process.argv);
}

main().then();
