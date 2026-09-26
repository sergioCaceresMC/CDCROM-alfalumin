import { z } from "zod";

// Optional so existing saves continue to validate. Embedded text travels with snapshots.
export const sourceSchema = z.object({
  document: z.literal("SRD 5.2.1"),
  page: z.number().int().min(1).max(398),
  name: z.string().min(1).max(200),
  text: z.string().max(12000).optional(),
}).strict();
export type Source = z.infer<typeof sourceSchema>;
