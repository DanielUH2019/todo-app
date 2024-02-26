import { taskModel, TaskModel } from "../models/task.d";

import axiosClient from "./client";

export const createTodo = async (task: TaskModel): Promise<TaskModel> => {
  try {
    const response = await axiosClient.post(`/Tasks/`, task);
    const parsedData = taskModel.parse(response.data);
    return parsedData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTodo = async (task: TaskModel): Promise<void> => {
  try {
    await axiosClient.put(`/Tasks/${task.Id}`, task);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete(`/Tasks/${id}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
