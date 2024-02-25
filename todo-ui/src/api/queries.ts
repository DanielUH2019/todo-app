import buildQuery from "odata-query";


import {
  taskModel,
  taskModelList,
  TaskModel,
  TaskModelList,
} from "../models/task.d";

import axiosClient from "./client";

export const fetchTodosWithQuery = async (
  query: any
): Promise<TaskModelList> => {
  // const queryString = buildQuery(query);
  try {
    // const response = await axiosClient.get(`/Tasks?${queryString}`);
    const response = await axiosClient.get(`/Tasks`);
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
