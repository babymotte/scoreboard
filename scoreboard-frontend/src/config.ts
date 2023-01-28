import { Config } from "worterbuch-react";

declare global {
  interface Window {
    globalConfig: Config;
  }
}

export function config(): Config {
  return window.globalConfig;
}
