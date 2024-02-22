import { z } from "zod";

export const taskModel = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  isCompleted: z.boolean(),
  createdAt: z.string(),
});

export const taskModelList = z.array(taskModel);

export type TaskModel = z.infer<typeof taskModel>;
export type TaskModelList = z.infer<typeof taskModelList>;