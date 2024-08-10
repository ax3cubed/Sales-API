import dotenv, { config } from "dotenv";
config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});
import { cleanEnv, host, num, port, str, testOnly } from "envalid";

export const {
  PORT,
  COMMON_RATE_LIMIT_MAX_REQUESTS,
  COMMON_RATE_LIMIT_WINDOW_MS,
  CORS_ORIGIN,
  HOST,
  NODE_ENV,
} = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
});

export const envs = {
  ...process.env,
  ...dotenv.config().parsed,
};
