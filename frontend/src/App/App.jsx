import { RouterProvider } from "react-router-dom";
import router from "./app.route";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../Features/Auth/services/auth.service";
import { setUser, setInitialized } from "../Features/Auth/state/auth.slice";

function App() {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkSession = async () => {
      const data = await getMe();
      if (data?.success) {
        dispatch(setUser(data.user));
      }
      dispatch(setInitialized(true));
    };
    checkSession();
  }, [dispatch]);

  if (!isInitialized) {
    return null; // Or a global loading spinner
  }

  return <RouterProvider router={router} />;
}

export default App;
