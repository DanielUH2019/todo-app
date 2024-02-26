import { TaskModel } from "../models/task";
import {
  List,
  Button,
  Flex,
  Space,
  Input,
  Select,
  message,
  Badge,
  Tooltip,
} from "antd";
const { Search } = Input;
import { FilterOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodosCount, fetchTodosWithQuery } from "../api/queries";
import { createTodo } from "../api/mutations";
import { useState } from "react";
import type { SearchProps } from "antd/es/input/Search";
import { useDebounce } from "@uidotdev/usehooks";
import { FilterOptions } from "../types/filter_options";

import { Todo } from "./Todo";

const TodoList: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [filter, setFilter] = useState<FilterOptions>("All");
  const [searchText, setSearchText] = useState<string>("");

  const debouncedFilter = useDebounce(searchText, 500);

  const errorMessage = (c: string) => {
    messageApi.open({
      type: "error",
      content: c,
    });
  };

  const { isPending, error, data } = useQuery({
    queryKey: ["tasks", debouncedFilter],
    queryFn: () => fetchTodosWithQuery(debouncedFilter),
    placeholderData: [],
  });

  const countResponse = useQuery({
    queryKey: ["count"],
    queryFn: () => fetchTodosCount(),
  });

  const addMutation = useMutation({
    mutationFn: (newTodo: TaskModel) => createTodo(newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["count"] });
    },
    onError: (err: any) => {
      return <>{errorMessage(`Error creating new Task ${err}`)}</>;
    },
  });

  const handleFilter = (value: FilterOptions) => {
    setFilter(value);
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) => {
    console.log(info?.source, value);
    setSearchText(value);
  };

  const handleAdd = () => {
    if (newTaskName == "") {
      return;
    }
    const t: TaskModel = {
      Id: 0,
      Name: newTaskName,
      IsComplete: false,
      CreationTime: new Date(),
      CompletedAt: null,
    };
    console.log("Adding todo...");
    addMutation.mutate(t);
    console.log("Todo added!");
  };

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }
  let tasks = [...data];
  if (filter === "Completed") {
    tasks = data.filter((task) => task.IsComplete);
  } else if (filter === "Active") {
    tasks = data.filter((task) => !task.IsComplete);
  }
  return (
    <div className="todo">
      <Flex gap="middle" align="center" wrap="wrap" justify="center">
        {contextHolder}
        <List
          header={
            <Space style={{ width: "100%" }}>
              <Search
                placeholder="input search text"
                onSearch={onSearch}
                style={{ width: 200 }}
              />
              <Select
                defaultValue="All"
                style={{ width: 100 }}
                onChange={handleFilter}
                options={[
                  { value: "All", label: "All" },
                  { value: "Completed", label: "Completed" },
                  { value: "Active", label: "Active" },
                ]}
                suffixIcon={<FilterOutlined />}
              />
              <Tooltip title="Total tasks in database">
                <Badge
                  className="site-badge-count-109"
                  count={countResponse.data}
                  style={{ backgroundColor: "#0000FF" }}
                />
              </Tooltip>
            </Space>
          }
          bordered={true}
          dataSource={tasks}
          renderItem={(item) => <Todo item={item} />}
          footer={
            <Space.Compact style={{ width: "100%" }}>
              <Input
                autoFocus={true}
                defaultValue="Add new task"
                onChange={(e) => {
                  setNewTaskName(e.target.value);
                }}
              />
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={() => handleAdd()}
              ></Button>
            </Space.Compact>
          }
        />
      </Flex>
    </div>
  );
};

export default TodoList;
