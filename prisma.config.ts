import { loadEnvConfig } from "@next/env";
import { defineConfig, env } from "prisma/config";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default defineConfig({
  schema: "database",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
