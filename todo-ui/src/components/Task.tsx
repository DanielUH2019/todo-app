import { TaskModel } from "../models/task";

interface TaskProps {
  task: TaskModel;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  return (
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => {}}
      />
      <label>{task.name}</label>
      <button className="edit" onClick={() => {}}/>
      <button className="destroy" onClick={() => {}}/>
      {/* <p>Created At: {task.createdAt}</p> */}
    </div>
  );
};

export default Task;
