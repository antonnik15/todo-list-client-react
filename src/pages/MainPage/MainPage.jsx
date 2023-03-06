import React, { useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

import "./MainPage.scss";


const MainPage = () => {
  const [text, setText] = useState("");
  const { userId } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toDoId, setToDoId] = useState("");

  const baseUrl = 'https://to-do-list-back-nest-6krxrhxnd-antonnik15.vercel.app'

  const getAllTasks = useCallback(async () => {
    try {
      await axios.get(`${baseUrl}/todo`, {
        headers: {
          "Content-Type": "application/json"
        },
        params: { userId }
      })
        .then(response => setTodos(response.data));
    } catch (err) {
      console.log(err);
    }
  }, [userId]);


  useEffect(() => {
    getAllTasks();
  }, [getAllTasks]);


  const createToDo = useCallback(async () => {
    if (!text) return null;
    try {
      await axios.post(`${baseUrl}/todo/add`, { text, userId }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          setTodos([...todos]);
          setText("");
          getAllTasks();
        })
        .catch((error) => {
          const errorArray = error.response.data.message.map(e => e.message);
          errorArray.forEach(e => alert(e));
        });
    } catch (err) {
      console.log(err);
    }
  }, [text, userId, todos, getAllTasks]);


  const updateToDo = useCallback(async () => {
    if (!text) return null;
    try {
      await axios.put(`${baseUrl}/todo/${toDoId}`, { text }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          setTodos([...todos]);
          setText("");
          setToDoId("");
          setIsUpdating(false);
          getAllTasks();
        })
        .catch((error) => {
          const errorArray = error.response.data.message.map(e => e.message);
          errorArray.forEach(e => alert(e));
        });
    } catch (err) {
      console.log(err);
    }
  }, [text, todos, getAllTasks, toDoId]);


  const deleteTask = useCallback(async (id) => {
    try {
      await axios.delete(`${baseUrl}/todo/${id}`, { id }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(() => getAllTasks());
    } catch (err) {
      console.log(err);
    }
  }, [getAllTasks]);


  const completeTask = useCallback(async (id) => {
    try {
      await axios.put(`${baseUrl}/todo/complete/${id}`, { id }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          setTodos([...todos]);
          getAllTasks();
        });
    } catch (err) {
      console.log(err);
    }
  }, [getAllTasks, todos]);


  const updateImportantStatus = useCallback(async (id) => {
    try {
      await axios.put(`${baseUrl}/todo/important/${id}`, { id }, {
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(() => {
          setTodos([...todos]);
          getAllTasks();
        });
    } catch (err) {
      console.log(err);
    }
  }, [getAllTasks, todos]);

  function setFocus() {
    document.getElementById("text").focus();
  }

  return (
    <div className="container">
      <div className="main-page">
        <h4> Add task:</h4>
        <form className="form form-login"
              onSubmit={e => e.preventDefault()}>
          <div className="row">
            <div className="input-field col s12">
              <input
                type="text"
                id="text"
                name="input"
                className="validate"
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <label htmlFor="input">Task:</label>
            </div>
          </div>
          <div className="row">
            <button
              className="waves-effect waves-light btn #00acc1 cyan darken-1" onClick={ isUpdating ? updateToDo : createToDo}>

              {(isUpdating) ? "Update" : "Add"}

            </button>
          </div>
        </form>
        <h3> Active tasks:</h3>
        <div className="todos">

          {
            todos.map((todo, index) => {
                let cls = ["row flex todos-item"];

                if (todo.completedStatus) {
                  cls.push("completed");
                }

                if (todo.importantStatus) {
                  cls.push("important");
                }


                return (
                  <div className={cls.join(" ")} key={index}>
                    <div className="col todos-num">{index + 1}</div>
                    <div className="col todos-text">{todo.text}</div>
                    <div className="col todos-createdAt">createdAt: {todo.createdAt}</div>
                    <div className="col todos-buttons">
                      <i className="material-icons dark-text" onClick={() => {
                        setIsUpdating(true);
                        setToDoId(todo.id);
                        setText(todo.text);
                        setFocus();
                      }}>create</i>
                      <i className="material-icons blue-text" onClick={() => completeTask(todo.id)}>check</i>
                      <i className="material-icons orange-text" onClick={() => updateImportantStatus(todo.id)}>warning</i>
                      <i className="material-icons red-text" onClick={() => deleteTask(todo.id)}>delete</i>
                    </div>
                  </div>
                );
              }
            )
          }
        </div>
      </div>
    </div>
  );
};

export default MainPage;
