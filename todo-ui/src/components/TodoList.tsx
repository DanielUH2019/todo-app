import { TaskModel, TaskModelList } from "../models/task";
import Task from "./Task";
// import { createTodo } from "../api/mutations";

// import { useQuery } from "@tanstack/react-query";

import { FilterOptions } from "../App";
interface TaskListProps {
  filter: FilterOptions;
}
 
import { Divider, List, Typography, Button } from "antd";
import { useQuery } from "@tanstack/react-query";
import { fetchTodosWithQuery } from "../api/queries";

const TodoList: React.FC<TaskListProps> = ({ filter }) => {

  const { isPending, error, data } = useQuery({
    queryKey: ["tasks"],
    queryFn: (query: any) => fetchTodosWithQuery(query),
    placeholderData: [],
  });
  // use state for filter value

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }
  let tasks = [...data]
  if (filter === "Completed") {
    tasks = data.filter((task) => task.IsComplete);
  } else if (filter === "Active") {
    tasks = data.filter((task) => !task.IsComplete);
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
