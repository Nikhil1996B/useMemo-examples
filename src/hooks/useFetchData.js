import { useReducer } from "react";

const types = {
  FETCH_DATA_REQUESTED: "FETCH_DATA_REQUESTED",
  FETCH_DATA_SUCCESS: "FETCH_DATA_SUCCESS",
  FETCH_DATA_FAILURE: "FETCH_DATA_FAILURE",
  LOADING: "LOADING",
};

const initialState = {
  data: null,
  error: null,
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case types.FETCH_DATA_REQUESTED:
      return { ...state, loading: true };
    case types.FETCH_DATA_SUCCESS:
      return { ...state, loading: false, error: null, data: action.payload };
    case types.FETCH_DATA_FAILURE:
      return { ...state, loading: false, error: action.payload, data: null };
    case types.LOADING:
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function useFetch(url) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const handleSuccess = (data) =>
    dispatch({ type: types.FETCH_DATA_SUCCESS, payload: data });
  const setLoadingFalse = () => dispatch({ type: types.LOADING });
  const handleError = (error) =>
    dispatch({ type: types.FETCH_DATA_FAILURE, payload: error });
  const responseToJson = (response) => response.json();

  const sleep = (response, delay = 3000) =>
    new Promise((resolve) => setTimeout(resolve(response), delay));

  const responseStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(
        new Error(
          response?.statusText || "Something went wrong while fetching data",
        ),
      );
    }
  };

  const fetchData = () => {
    dispatch({ type: types.FETCH_DATA_REQUESTED });
    fetch(url)
      .then(responseStatus)
      .then(responseToJson)
      // DEV only
      .then((response) => sleep(response, 4000))
      .then(handleSuccess)
      .catch(handleError)
      .finally(setLoadingFalse);
  };

  const { data, error, loading } = state;
  return {
    data,
    error,
    loading,
    fetchData,
  };
}
