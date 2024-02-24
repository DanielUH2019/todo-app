import buildQuery from "odata-query";
import axios, {
  isCancel,
  AxiosResponse,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";

import {
  taskModel,
  taskModelList,
  TaskModel,
  TaskModelList,
} from "../models/task.d";

export const fetchTodosWithQuery = async (query: any): Promise<TaskModelList> => {
  const queryString = buildQuery(query);
  try {
    const response = await axios.get(`/odata/Todos?${queryString}`);
    const parsedData = taskModelList.parse(response.data.value);
    return parsedData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchTodoById = async (id: number): Promise<TaskModel> => {
  try {
    const response = await axios.get(`/odata/Todos(${id})`);
    const parsedData = taskModel.parse(response.data);
    return parsedData;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



