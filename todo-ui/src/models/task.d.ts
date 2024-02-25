import { z } from "zod";

export const taskModel = z.object({
  Id: z.number(),
  Name: z.string(),
  IsComplete: z.boolean(),
  CreationTime: z.coerce.date(),
  CompletedAt: z.coerce.date().nullable()
});

export const taskModelList = z.array(taskModel);

export type TaskModel = z.infer<typeof taskModel>;
export type TaskModelList = z.infer<typeof taskModelList>;