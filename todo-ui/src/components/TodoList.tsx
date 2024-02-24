import { TaskModel, TaskModelList } from "../models/task";
import Task from "./Task";
// import { createTodo } from "../api/mutations";

// import { useQuery } from "@tanstack/react-query";

import { FilterOptions } from "../App";
interface TaskListProps {
  tasks: TaskModelList;
  filter: FilterOptions;
}
 
import { Divider, List, Typography, Button } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

<PlusCircleOutlined />;

const TodoList: React.FC<TaskListProps> = ({ tasks, filter }) => {
  if (filter === "Completed") {
    tasks = tasks.filter((task) => task.isCompleted);
  } else if (filter === "Active") {
    tasks = tasks.filter((task) => !task.isCompleted);
  }
  return (
    <div className="todo">
      <Divider orientation="left">Default Size</Divider>
    <List
      header={<div>Todo List</div>}
      // footer={<div>Footer</div>}
      bordered
      dataSource={tasks}
      renderItem={(item) => (
        <List.Item>
          <Task task={item} />
        </List.Item>
      )} />
      {/* <h1>Task List</h1>
      {tasks.map((task) => (
        <div key={task.id}>
          <Task task={task} />
        </div>
      ))} */}
    </div>
  );
};

export default TodoList;
