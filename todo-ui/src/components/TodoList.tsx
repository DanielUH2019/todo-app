import { TaskModel, TaskModelList } from "../models/task";
import Task from "./Task";

interface TaskListProps {
  tasks: TaskModelList;
  onAddTask: () => void;
  onEditTask: (task: TaskModel) => void;
  onDeleteTask: (id: number) => void;
}

const TodoList: React.FC<TaskListProps> = ({
  tasks,
 
}) => {
  return (
    <div>
      <h1>Task List</h1>
      {tasks.map((task) => (
        <div key={task.id}>
          <Task task={task} />
        </div>
      ))}
      <button className="add" onClick={() => {}}>Add Task</button>
    </div>
  );
};

export default TodoList;
