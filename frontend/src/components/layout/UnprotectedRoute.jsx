import { useGetMeQuery } from "../../redux/apis/userApi";
import Loader from "../ui/Loader";

export default function UnprotectedRoute({ children }) {
  const { isLoading } = useGetMeQuery();

  return isLoading ? <Loader /> : children;
}
