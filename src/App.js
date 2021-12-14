import { useEffect, useReducer, useState } from 'react';
import './App.css';

const initialState = [];

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return [...state, action.payload];
    default:
      return [...state];
  }
};

const App = () => {
  const [counter, setCounter] = useState(0);
  const [stringResult, setStringResult] = useState('');
  const [page, setPage] = useState(1);
  const [state, dispatch] = useReducer(reducer, initialState);

  const counterIncreaseHandler = () => {
    setCounter(counter + 1);
  };

  const increasePageHandler = () => {
    if (page >= state.length / 3) {
      return
    }
    setPage(page + 1);
  };

  const decreasePageHandler = () => {
    if (page - 1 !== 0) {
      setPage(page - 1);
    }
  };

  const addUserHandler = () => {
    const data = JSON.parse(stringResult);
    const uniqueId = data.login.uuid;
    const idList = state.map(u => u.id);
    if (!idList.find(id => id === uniqueId)) {
      dispatch({
        type: 'ADD_USER', payload: {
          id: data.login.uuid,
          user: {
            firstName: data.name.first,
            lastName: data.name.last,
            image: data.picture.large
          }
        }
      });
    } else {
      alert('User with that id already registered.');
    }
  };

  const fetchStringData = async () => {
    const response = await fetch('https://randomuser.me/api');
    const responseData = await response.json();
    setStringResult(JSON.stringify(responseData.results[0]));
  };

  useEffect(() => {
    fetchStringData();
  }, []);


  return (
    <div className="App">
      <h1>Hello World</h1>
      <h2>
        counter: {counter}
      </h2>
      <button onClick={counterIncreaseHandler}>Increase</button>
      <h2>
        <button onClick={fetchStringData}>
          Fetch
        </button>
        API String :
      </h2>
      <p> {stringResult}</p>
      <h2>
        User Data
        <button onClick={addUserHandler}>+</button>
      </h2>
      <div>
        <button onClick={decreasePageHandler}>&lt;</button>
        Page: {page}
        <button onClick={increasePageHandler}>&gt;</button>
      </div>
      {
        state.length < 4 ? state.map(u => {
          return (
            <div key={u.id}>
              <p>{u.user.firstName} {u.user.lastName}</p>
              <img src={u.user.image} alt={`${u.user.firstName} ${u.user.lastName}`} />
            </div>
          )
        }) : ''
      }
      {
        state.length >= 4 ? state.slice((3 * page - 3), (3 * page)).map(u => {
          return (
            <div key={u.id}>
              <p>{u.user.firstName} {u.user.lastName}</p>
              <img src={u.user.image} alt={`${u.user.firstName} ${u.user.lastName}`} />
            </div>
          )
        }) : ''
      }
    </div >
  );
}

export default App;
