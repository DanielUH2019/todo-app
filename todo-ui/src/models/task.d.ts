import { z } from "zod";

export const taskModel = z.object({
  id: z.number(),
  name: z.string(),
  isCompleted: z.boolean(),
  createdAt: z.date(),
});

export const taskModelList = z.array(taskModel);

export type TaskModel = z.infer<typeof taskModel>;
export type TaskModelList = z.infer<typeof taskModelList>;