import { TaskModel } from "../models/task";
import { deleteTodo } from "../api/mutations";
import { EditTodo } from "./EditTodo";

import { useMutation } from "@tanstack/react-query";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface TaskProps {
  task: TaskModel;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const mutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id),
  });

  return (
    <div className="view">
      {/* <input
        className="toggle"
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => {}}
        on
      /> */}
      <label>{task.name}</label>
      <EditOutlined>
        <button
          className="edit"
          onClick={() => {
            <EditTodo idToEdit={task.id} />;
          }}
        />
      </EditOutlined>
      <DeleteOutlined>
        <button
          className="destroy"
          onClick={() => {
            mutation.mutate(task.id);
          }}
        />
      </DeleteOutlined>

      {/* <p>Created At: {task.createdAt}</p> */}
    </div>
  );
};

export default Task;
