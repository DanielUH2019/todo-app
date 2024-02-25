//📂./src/components/AddTodo.tsx

import { useEffect, useRef, useState } from "react";
import { createTodo } from "../api/mutations";
import { useMutation } from "@tanstack/react-query";
import { TaskModel } from "../models/task";
import { Button, Input } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

export const AddTodo = () => {
  const [input, setInput] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const mutation = useMutation({
    mutationFn: (newTodo: TaskModel) => createTodo(newTodo),
  });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    const t: TaskModel = {
      Id: 0,
      Name: input,
      IsComplete: false,
      CreationTime: new Date(),
    };

    mutation.mutate(t);
    return (
      <div>
        {mutation.isPending ? (
          "Adding todo..."
        ) : (
          <>
            {mutation.isError ? (
              <div>An error occurred: {mutation.error.message}</div>
            ) : null}

            {mutation.isSuccess ? <div>Todo added!</div> : null}
          </>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmission}>
      <div className="add-todo">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          className="input-todo"
          placeholder="start typing ..."
          // {/* <input
          //   ref={inputRef}
          //   value={input}
          //   onChange={(e) => setInput(e.target.value)}
          //   type="text"
          //   className="input-todo"
          //   placeholder="start typing ..."
          // /> */}
        />
        <Button type="primary" icon={<PlusCircleOutlined />}>
          Add task
        </Button>
      </div>
    </form>
  );
};
