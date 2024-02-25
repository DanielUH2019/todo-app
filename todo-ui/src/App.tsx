import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import TodoList from "./components/TodoList";
// import { fetchTodosWithQuery } from "./api/queries";


import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AddTodo } from "./components/AddTodo";

import { Select, Space, Input } from "antd";
import { FilterOutlined } from "@ant-design/icons";

import type { SearchProps } from "antd/es/input/Search";

const { Search } = Input;

const queryClient = new QueryClient();

export declare type FilterOptions = "All" | "Completed" | "Active";

function App() {
  // const qClient = useQueryClient(queryClient)
  const [filter, setFilter] = useState<FilterOptions>("All");
  console.log('hello')
  

  const handleFilter = (value: FilterOptions) => {
    setFilter(value);
  };

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <header className="App-header">
          <img src={reactLogo} className="App-logo" alt="logo" />
          <img src={viteLogo} className="App-logo" alt="logo" />
        </header>
        <AddTodo />
        <Search
          placeholder="input search text"
          onSearch={onSearch}
          style={{ width: 200 }}
          
        />
        <Select
          defaultValue="All"
          style={{ width: 120 }}
          onChange={handleFilter}
          options={[
            { value: "All", label: "All" },
            { value: "Completed", label: "Completed" },
            { value: "Active", label: "Active" },
          ]}
          suffixIcon={<FilterOutlined />}
        />

        <TodoList filter={filter} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
