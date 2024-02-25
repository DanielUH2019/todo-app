import buildQuery from "odata-query";

import {
  taskModel,
  taskModelList,
  TaskModel,
  TaskModelList,
} from "../models/task.d";

import axiosClient from "./client";

const orderBy = ["IsComplete asc", "CompletedAt desc"];

export const fetchTodosWithQuery = async (
  query: any
): Promise<TaskModelList> => {
  const queryString = buildQuery({ orderBy });
  try {
    const response = await axiosClient.get(`/Tasks${queryString}`);
    const parsedData = taskModelList.parse(response.data.value);
    return parsedData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchTodoById = async (id: number): Promise<TaskModel> => {
  try {
    const response = await axiosClient.get(`/Tasks/${id}`);
    const parsedData = taskModel.parse(response.data);
    return parsedData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
