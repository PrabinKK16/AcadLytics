import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./redux/slices/authSlice";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
