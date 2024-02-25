
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import TodoList from "./components/TodoList";
// import { fetchTodosWithQuery } from "./api/queries";


import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";



const queryClient = new QueryClient();

export declare type FilterOptions = "All" | "Completed" | "Active";

function App() {
  // const qClient = useQueryClient(queryClient)
  
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <header className="App-header">
          <img src={reactLogo} className="App-logo" alt="logo" />
          <img src={viteLogo} className="App-logo" alt="logo" />
        </header>
        <TodoList />
      </div>
    </QueryClientProvider>
  );
}

export default App;
