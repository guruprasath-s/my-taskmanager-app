import React, { Fragment, useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Paper, IconButton, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import Box from "@material-ui/core/Box";
import EditIcon from "@material-ui/icons/Edit";
import Editable from "./Editable";
import EditTaskFormDialog from "./EditTaskFormDialog";
import DragSortableList from "react-drag-sortable";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1)
  },
  listContent: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  listFooter: {
    display: "flex"
  },
  inlineInput: {
    height: "30px",
    maxWidth: "150px",
    minWidth: "100px",
    fontSize: "16px"
  },
  label: {
    fontSize: "17px",
    color: "#212121"
  },
  subtitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#424242"
  },
  taskContainer: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    color: "#9e9e9e"
  },
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(1)
  },
  taskContent: {
    padding: theme.spacing(1)
  },
  taskDate: {
    padding: theme.spacing(1),
    color: "#37474f",
    fontSize: "12px",
    opacity: "0.5"
  },
  iconBtn: {
    [theme.breakpoints.up("md")]: {
      width: "20px",
      height: "20px"
    },
    [theme.breakpoints.down("sm")]: {
      width: "20px",
      height: "20px"
    }
  }
}));

export default function DashboardPage() {
  const classes = useStyles();
  const [state, setstate] = useState([]);
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState({ taskId: "", listId: "" });
  const inputRef = useRef();
  useEffect(() => {
    try {
      const state = JSON.parse(localStorage.getItem("tasksList")) || [];
      const count = state.length;
      setstate(state);
      setCount(count + 1);
    } catch (e) {
      console.log(e);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("tasksList", JSON.stringify(state));
  }, [state]);
  const handleAddList = () => {
    let listName = `List ${count}`;
    let newList = {
      id: _.uniqueId(`list_${count}_`),
      name: listName,
      tasks: []
    };
    setstate([...state, newList]);
    setCount(count + 1);
  };
  const handleDeleteList = (id) => {
    let updatedLists = state.filter((list) => list.id !== id);
    setstate([...updatedLists]);
    setCount(count - 1);
  };
  const handleEditListLabel = (data, id) => {
    let updatedLists = state.map((list) => {
      if (list.id === id) {
        return {
          ...list,
          name: data
        };
      } else {
        return list;
      }
    });
    setstate([...updatedLists]);
  };
  const handleAddTask = (id) => {
    let taskName = `Task`;
    let newTask = {
      id: _.uniqueId(`${id}_task_`),
      name: taskName,
      date: `${new Date().toDateString()} ${new Date().toLocaleTimeString()}`,
      comments: []
    };
    let updatedLists = state.map((list) => {
      if (list.id === id) {
        return {
          ...list,
          tasks: [...list.tasks, newTask]
        };
      } else {
        return list;
      }
    });
    setstate([...updatedLists]);
  };
  const handleDeleteTask = (listId, taskId) => {
    let updatedLists = state.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          tasks: list.tasks.filter((task) => task.id !== taskId)
        };
      } else {
        return list;
      }
    });
    setstate([...updatedLists]);
  };
  const handleDialogOpen = (listId, taskId) => {
    setActiveId({ taskId: taskId, listId: listId });
    setOpen(true);
  };
  const handleDialogClose = () => {
    setActiveId({ taskId: "", listId: "" });
    setOpen(false);
  };
  const handleEditTask = (name, desc) => {
    let updatedLists = state.map((list) => {
      if (list.id === state[activeId.listId].id) {
        return {
          ...list,
          tasks: list.tasks.map((task) => {
            if (task.id === list.tasks[activeId.taskId].id) {
              return {
                ...task,
                name: name,
                description: desc
              };
            } else {
              return task;
            }
          })
        };
      } else {
        return list;
      }
    });
    setstate([...updatedLists]);
    setActiveId({ taskId: "", listId: "" });
    setOpen(false);
  };
  const handleAddTaskComment = (comment) => {
    let updatedLists = state.map((list) => {
      if (list.id === state[activeId.listId].id) {
        return {
          ...list,
          tasks: list.tasks.map((task) => {
            if (task.id === list.tasks[activeId.taskId].id) {
              return {
                ...task,
                comments: [...task.comments, comment]
              };
            } else {
              return task;
            }
          })
        };
      } else {
        return list;
      }
    });
    setstate([...updatedLists]);
  };
  const onSort = (sortedTask) => {
    console.log("sort", sortedTask);
    let sortedArr = [];
    let listIndex =
      sortedTask.length > 0 ? sortedTask[0].classes[0].split("_")[1] : 0;
    _.forEach(sortedTask, (task) => {
      let taskIndex = task.classes[0].split("_")[0];
      sortedArr.push(taskIndex);
    });
    let not_sorted_tasks = state[listIndex].tasks;
    let sorted_tasks = sortedArr.reduce(function (acc, key, i) {
      acc[i] = not_sorted_tasks[key];
      return acc;
    }, []);
    let updatedLists = state.map((list) => {
      if (list.id === state[listIndex].id) {
        return {
          ...list,
          tasks: [...sorted_tasks]
        };
      } else {
        return list;
      }
    });
    setstate([...updatedLists]);
  };
  const setDragTaskList = (list, i) => {
    let dragList = list.tasks.map((task, index) => {
      return {
        content: (
          <Paper className={classes.taskContainer} key={index}>
            <div className={classes.taskHeader}>
              <Typography className={classes.subtitle}>{task.name}</Typography>
              <Box display="flex" justifyContent="space-between">
                <IconButton
                  color="primary"
                  onClick={() => {
                    handleDialogOpen(i, index);
                  }}
                >
                  <EditIcon className={classes.iconBtn} />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(list.id, task.id);
                  }}
                >
                  <HighlightOffIcon className={classes.iconBtn} />
                </IconButton>
              </Box>
            </div>
            {task.description && (
              <div className={classes.taskContent}>
                <Typography>{task.description}</Typography>
              </div>
            )}
            <div className={classes.taskDate}>{task.date}</div>
          </Paper>
        ),
        classes: [`${index}_${i}`]
      };
    });
    return (
      <DragSortableList
        items={dragList}
        moveTransitionDuration={0.3}
        onSort={onSort}
        type="vertical"
      ></DragSortableList>
    );
  };
  const selectedTask =
    activeId.listId !== "" && activeId.taskId !== ""
      ? state[activeId.listId].tasks[activeId.taskId]
      : {};
  return (
    <Fragment>
      <Grid container spacing={3}>
        {state.length > 0 &&
          state.map((list, i) => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Paper className={classes.paper}>
                  <div className={classes.listHeader}>
                    <Editable
                      text={list.name}
                      placeholder="Write a List name"
                      childRef={inputRef}
                      type="input"
                      classes={classes.label}
                    >
                      <input
                        ref={inputRef}
                        type="text"
                        name="task"
                        className={classes.inlineInput}
                        placeholder="Write a List name"
                        value={list.name}
                        onChange={(e) =>
                          handleEditListLabel(e.target.value, list.id)
                        }
                      />
                    </Editable>
                    <IconButton
                      color="secondary"
                      classes={{ root: classes.moreButton }}
                      aria-owns="widget-menu"
                      onClick={() => {
                        handleDeleteList(list.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  {list.tasks.length > 0 && (
                    <div className={classes.listContent}>
                      {setDragTaskList(list, i)}
                    </div>
                  )}
                  <div className={classes.listFooter}>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        handleAddTask(list.id);
                      }}
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </div>
                </Paper>
              </Grid>
            );
          })}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Button
            color="inherit"
            onClick={handleAddList}
            startIcon={<AddCircleIcon />}
          >
            Add New List
          </Button>
        </Grid>
        {open && (
          <EditTaskFormDialog
            open={open}
            handleClose={handleDialogClose}
            task={selectedTask}
            handleSave={(name, desc) => {
              handleEditTask(name, desc);
            }}
            handleAddComment={(comment) => {
              handleAddTaskComment({
                comment,
                date: `${new Date().toDateString()} ${new Date().toLocaleTimeString()}`
              });
            }}
          />
        )}
      </Grid>
    </Fragment>
  );
}
