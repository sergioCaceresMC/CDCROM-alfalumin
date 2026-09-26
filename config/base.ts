export const basePath = (process.env.VITE_BASE_PATH || "/").replace(/^\/*|\/*$/g, "");
export const base = basePath ? `/${basePath}/` : "/";
