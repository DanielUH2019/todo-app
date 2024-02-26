import { TaskModel, TaskModelList } from "../models/task";

// import { createTodo } from "../api/mutations";

// import { useQuery } from "@tanstack/react-query";

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
  Select,
} from "antd";
const { Search } = Input;
import { FilterOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTodosWithQuery } from "../api/queries";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { createTodo, deleteTodo, updateTodo } from "../api/mutations";
import { useState } from "react";
import type { SearchProps } from "antd/es/input/Search";
import { useDebounce } from "@uidotdev/usehooks";
import { FilterOptions } from "../types/filter_options";

const TodoList: React.FC = () => {
  const queryClient = useQueryClient();
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [filter, setFilter] = useState<FilterOptions>("All");
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [idToEdit, setIdToEdit] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  const debouncedFilter = useDebounce(searchText, 500);

  const { isPending, error, data } = useQuery({
    queryKey: ["tasks", debouncedFilter],
    queryFn: () => fetchTodosWithQuery(debouncedFilter),
    placeholderData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: (newTodo: TaskModel) => createTodo(newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedTodo: TaskModel) => updateTodo(editedTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const completeMutation = useMutation({
    mutationFn: (t: TaskModel) => {
      t.IsComplete = true;
      t.CompletedAt = new Date();
      return updateTodo(t);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  // use state for filter value

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
      CompletedAt: null,
    };
    setConfirmLoading(true);
    setModalText("The modal will be closed after edit is completed");
    updateMutation.mutate(editedTask);
    setConfirmLoading(false);
    setOpenEdit(false);
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
      <Flex gap="middle" align="center" wrap="wrap" justify="center">
        <List
          header={
            <Space.Compact style={{ width: "100%" }}>
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
            </Space.Compact>
          }
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
                    setModalText(item.Name);
                    setIdToEdit(item.Id);
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

                <Tooltip
                  title={
                    item.CompletedAt === null
                      ? `Created at: ${item.CreationTime.toUTCString()}`
                      : `Completed at: ${item.CompletedAt}`
                  }
                >
                  <Typography.Text delete={item.IsComplete}>
                    {item.Name}
                  </Typography.Text>
                </Tooltip>
              </Space>
              <Modal
                title="Edit Task"
                open={openEdit}
                onOk={() => handleOk(idToEdit)}
                confirmLoading={confirmLoading}
                onCancel={() => handleCancel()}
              >
                <Input
                  placeholder={modalText}
                  onChange={(e) => setModalText(e.target.value)}
                />
              </Modal>
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
