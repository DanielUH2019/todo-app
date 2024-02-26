import { TaskModel } from "../models/task";

import {
  List,
  Typography,
  Button,
  Checkbox,
  Tooltip,
  Space,
  Input,
  Modal,
  Popconfirm,
  message,
} from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteTodo, updateTodo } from "../api/mutations";
import { useState } from "react";

interface Props {
  item: TaskModel;
}

export const Todo: React.FC<Props> = ({ item }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [idToEdit, setIdToEdit] = useState<number>(0);

  const showModal = () => {
    setOpenEdit(true);
  };

  const errorMessage = (c: string) => {
    messageApi.open({
      type: "error",
      content: c,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err: any) => {
      return <>{errorMessage(`Error editing Task: ${err}`)}</>;
    },
  });

  const updateMutation = useMutation({
    mutationFn: (editedTodo: TaskModel) => updateTodo(editedTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err: any) => {
      return <>{errorMessage(`Error editing Task: ${err}`)}</>;
    },
  });

  const completeMutation = useMutation({
    mutationFn: (t: TaskModel) => {
      const checkedTask: TaskModel = {
        Id: t.Id,
        Name: t.Name,
        IsComplete: true,
        CreationTime: t.CreationTime,
        CompletedAt: new Date(),
      };

      return updateTodo(checkedTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err: any) => {
      return <>{errorMessage(`Error marking Task as completed: ${err}`)}</>;
    },
  });

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

  return (
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
      {contextHolder}
      <Space>
        <Popconfirm
          title="Conplete task"
          description="Are you sure?"
          onConfirm={() => completeMutation.mutate(item)}
          okText="Yes"
          cancelText="No"
        >
          <Checkbox disabled={item.IsComplete} checked={item.IsComplete} />
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
  );
};
