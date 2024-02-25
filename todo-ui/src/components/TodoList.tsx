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
  Modal,
  Popconfirm,
} from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchTodosWithQuery } from "../api/queries";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { createTodo, deleteTodo, updateTodo } from "../api/mutations";
import { useState } from "react";

const TodoList: React.FC<TaskListProps> = ({ filter }) => {
  const [newTaskName, setNewTaskName] = useState<string>("");

  const [openEdit, setOpenEdit] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

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

  const updateMutation = useMutation({
    mutationFn: (editedTodo: TaskModel) => updateTodo(editedTodo),
  });

  const completeMutation = useMutation({
    mutationFn: (t: TaskModel) => {
      t.IsComplete = true;
      return updateTodo(t);
    },
  });
  // use state for filter value

  const handleAdd = () => {
    const t: TaskModel = {
      Id: 0,
      Name: newTaskName,
      IsComplete: false,
      CreationTime: new Date(),
    };
    console.log("Adding todo...");
    addMutation.mutate(t);
    console.log("Todo added!");
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

  const showModal = () => {
    setOpenEdit(true);
  };

  const handleOk = (id: number) => {
    const editedTask: TaskModel = {
      Id: id,
      Name: modalText,
      IsComplete: false,
      CreationTime: new Date(),
    };
    setConfirmLoading(true);
    setModalText("The modal will be closed after edit is completed");
    updateMutation.mutate(editedTask);
  };

  const handleCancel = () => {
    console.log("Edit canceled");
    setOpenEdit(false);
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
                  type="primary"
                  className="edit-todo"
                  disabled={item.IsComplete}
                  icon={<EditOutlined />}
                  onClick={() => {
                    <Modal
                      title="Title"
                      open={openEdit}
                      onOk={() => handleOk(item.Id)}
                      confirmLoading={confirmLoading}
                      onCancel={handleCancel}
                    >
                      <Input
                        placeholder={item.Name}
                        onChange={(e) => setModalText(e.target.value)}
                      />
                    </Modal>;
                    showModal();
                  }}
                ></Button>,
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={() => deleteMutation.mutate(item.Id)}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />}></Button>
                </Popconfirm>,
              ]}
            >
              <Space>
                <Popconfirm
                  title="Conplete task"
                  description="Are you sure?"
                  onConfirm={() => completeMutation.mutate(item)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Checkbox
                    disabled={item.IsComplete}
                    checked={item.IsComplete}
                  />
                </Popconfirm>

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
