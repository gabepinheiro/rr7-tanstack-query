import { type Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: ['/about'],
  future: {
    unstable_middleware: true
  }
} satisfies Config;
