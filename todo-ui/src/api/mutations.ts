
import axios, {
  isCancel,
  AxiosResponse,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";

import {
  taskModel,
  TaskModel,
} from "../models/task.d";

export const createTodo = async (task: TaskModel): Promise<TaskModel> => {
  try {
    const response = await axios.post("/odata/Todos", task);
    const parsedData = taskModel.parse(response.data);
    return parsedData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateTodo = async (task: TaskModel): Promise<TaskModel> => {
  try {
    const response = await axios.put(`/odata/Todos(${task.id})`, task);
    const parsedData = taskModel.parse(response.data);
    return parsedData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await axios.delete(`/odata/Todos(${id})`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
