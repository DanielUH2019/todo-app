//📂./src/components/AddTodo.tsx

import { useEffect, useRef, useState } from "react";
import { updateTodo } from "../api/mutations";
import { useMutation } from "@tanstack/react-query";
import { TaskModel } from "../models/task";


interface EditProps {
  idToEdit: number;
}

export const EditTodo: React.FC<EditProps> = ({idToEdit}) => {
  const [input, setInput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const mutation = useMutation({
    mutationFn: (editedTodo: TaskModel) => updateTodo(editedTodo),
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const t: TaskModel = {
      id: idToEdit,
      name: input,
      isCompleted: false,
      createdAt: new Date(),
    };

    mutation.mutate( t );
    return (
      <div>
        {mutation.isPending ? (
          "editing todo..."
        ) : (
          <>
            {mutation.isError ? (
              <div>An error occurred: {mutation.error.message}</div>
            ) : null}

            {mutation.isSuccess ? <div>Todo edited!</div> : null}
          </>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmission}>
      <div className="edit-todo">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="edit-todo"
          placeholder="start typing ..."
        />
        <button type="submit" className="add-btn" name="Add">
          Submit
        </button>
      </div>
    </form>
  );
};
