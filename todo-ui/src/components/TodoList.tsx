import { TaskModel, TaskModelList } from "../models/task";

// import { createTodo } from "../api/mutations";

// import { useQuery } from "@tanstack/react-query";

import { FilterOptions } from "../App";
interface TaskListProps {
  filter: FilterOptions;
}

import {
  Divider,
  List,
  Typography,
  Button,
  Flex,
  Checkbox,
  Tooltip,
  Space,
  Input,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchTodosWithQuery } from "../api/queries";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { createTodo, deleteTodo } from "../api/mutations";
import { useState } from "react";

const TodoList: React.FC<TaskListProps> = ({ filter }) => {
  const [newTaskName, setNewTaskName] = useState<string>("");
  const { isPending, error, data } = useQuery({
    queryKey: ["tasks"],
    queryFn: (query: any) => fetchTodosWithQuery(query),
    placeholderData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
  });

  const addMutation = useMutation({
    mutationFn: (newTodo: TaskModel) => createTodo(newTodo),
  });

  // use state for filter value

  const handleAdd = () => {
    const t: TaskModel = {
      Id: 0,
      Name: newTaskName,
      IsComplete: false,
      CreationTime: new Date(),
    };

    addMutation.mutate(t);
    return (
      <div>
        {addMutation.isPending ? (
          "Adding todo..."
        ) : (
          <>
            {addMutation.isError ? (
              <div>An error occurred: {addMutation.error.message}</div>
            ) : null}

            {addMutation.isSuccess ? <div>Todo added!</div> : null}
          </>
        )}
      </div>
    );
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
      <Flex gap="middle" align="center" vertical>
        <List
          header={<div>Todo List</div>}
          // footer={<div>Footer</div>}
          bordered={true}
          dataSource={tasks}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  className="edit-todo"
                  icon={<EditOutlined />}
                  onClick={() => {
                    <EditTodo idToEdit={item.Id} />;
                  }}
                ></Button>,
                <Button
                  className="remove-todo"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    deleteMutation.mutate(item.Id);
                  }}
                ></Button>,
              ]}
            >
              <Space>
                <Checkbox onChange={() => {}} />
                <Tooltip title={item.CreationTime.toUTCString()}>
                  <Typography.Text mark></Typography.Text> {item.Name}
                </Tooltip>
              </Space>
            </List.Item>
          )}
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
                onClick={() => handleAdd}
              ></Button>
            </Space.Compact>
          }
        />
      </Flex>
    </div>
  );
};

export default TodoList;
