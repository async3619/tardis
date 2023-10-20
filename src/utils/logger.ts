import winston from "winston";
import dayjs from "dayjs";
import chalk from "chalk";
import { Fn } from "@utils/types";

const { combine, timestamp, printf } = winston.format;

const COLOR_MAP: Record<string, Fn<string, string>> = {
    error: chalk.red,
};

const formatter = printf(({ message, level, timestamp }) => {
    const time = dayjs(timestamp);
    const tokens = [
        chalk.green(`[${time.format("YYYY-MM-DD HH:mm:ss")}]`),
        COLOR_MAP[level](`[${level.toUpperCase()}]`),
        ` ${COLOR_MAP[level](message)}`,
    ];

    return tokens.join("");
});

export const logger = winston.createLogger({
    format: combine(timestamp(), formatter),
    transports: [new winston.transports.Console()],
});
