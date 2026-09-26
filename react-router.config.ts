import type { Config } from "@react-router/dev/config";
import { base } from "./config/base.ts";

export default {
  ssr: false,
  basename: base,
} satisfies Config;
