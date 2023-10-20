import path from "path";
import fs from "fs-extra";

import { Command, Option } from "commander";

import { BaseCommand } from "@root/commands/base";
import { Package } from "@root/package";
import { compact } from "lodash";

interface PackageCommandOptions extends Record<string, string> {
    dest: string;
}

export class PackageCommand extends BaseCommand<[name: string], PackageCommandOptions> {
    public constructor() {
        super("package <name>", "grab whole changelogs from a package on npm registry");
    }

    protected configure(p: Command): Command {
        return p.option("-d, --dest <path>", "specify destination path for generated changelog file", "./CHANGELOG.md");
    }

    protected async action(name: string, options: PackageCommandOptions): Promise<void> {
        const targetPackage = await Package.fromName(name);
        const changelogs = await targetPackage.getReleaseNotes();

        let targetPath = options.dest;
        if (!path.isAbsolute(targetPath)) {
            targetPath = path.join(process.cwd(), targetPath);
        }

        let content = "";
        for (const changelog of changelogs) {
            content += compact([`# ${changelog.title}`, changelog.content]).join("\n\n");
            content += "\n\n";
        }

        await fs.writeFile(targetPath, content);
    }
}
