import { Actor, AllActions, Remove, Search, Toggle, Write, Add, TarefaActionsEnum, TarefasState } from "./types";

export const makeInitialTarefaState = (): TarefasState => {
  const savedTasks = localStorage.getItem("tasks");
  if(savedTasks){ return JSON.parse(savedTasks);}
  
  return {
    tarefas: [],
    error: "",
    name: "",
    search: "",
  }
};

export const removeTask: Actor<Remove> = (state, action) => {
  const actualTasks = {
    ...state,
    tarefas: state.tarefas.filter((tarefa) => tarefa.id !== action.payload.id),
  };
  
  localStorage.setItem("tasks",JSON.stringify(actualTasks));
  return actualTasks;
};

export const toggleTask: Actor<Toggle> = (state, action) => {
  const updatedTasks = {
    ...state,
    tarefas: state.tarefas.map((t) =>
      t.id === action.payload.id ? { ...t, done: !t.done } : t
    ),
  };

  localStorage.setItem("tasks",JSON.stringify(updatedTasks));
  return updatedTasks;
};

export const writeTask: Actor<Write> = (state, { payload }) => {

  const hasTaskAlready = state.tarefas.some((t) => t.name === payload.name);

  if (hasTaskAlready) {
    return {
      ...state,
      name: payload.name,
      error: "Nome da tarefa já existe",
    };
  }

  return {
    ...state,
    error: "",
    name: payload.name,
  };
};

export const addTask: Actor<Add> = (state) => {
  if (state.name === "") {
    return {
      ...state,
      error: "Nome da tarefa não pode ser vazio",
    };
  }

  if (state.error) {
    return state;
  }

  const newTasks = {
    ...state,
    tarefas: [
      ...state.tarefas,
      {
        id: (state.tarefas.length + 1).toString(),
        name: state.name,
        done: false,
        createdAt: new Date(),
        expiredAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    ],
    error: "",
    name: "",
  };

  console.log(newTasks.tarefas);

  localStorage.setItem("tasks",JSON.stringify(newTasks));

  return newTasks;
};

export const searchTask: Actor<Search> = (state, action) => {
  return {
    ...state,
    search: action.payload.search,
  };
};

export const tarefaReducer = (
  state: TarefasState,
  action: AllActions
): TarefasState => {
  switch (action.type) {
    case TarefaActionsEnum.add:
      return addTask(state, action);

    case TarefaActionsEnum.remove:
      return removeTask(state, action);

    case TarefaActionsEnum.toggle:
      return toggleTask(state, action);

    case TarefaActionsEnum.write:
      return writeTask(state, action);

    case TarefaActionsEnum.search:
      return searchTask(state, action);

    default:
      return state;
  }
};
