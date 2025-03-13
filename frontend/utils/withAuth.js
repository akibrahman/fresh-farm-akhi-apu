import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetchMyProfileQuery } from "@/store/slices/api/userApiSlice";
import { setUser } from "@/store/slices/userSlice";

export function withAuth(
  Component,
  { requireLogin = false, requireAdmin = false }
) {
  return function WithAuth(props) {
    const { user } = useSelector((state) => state.user);
    const { data: currentUser } = useFetchMyProfileQuery(undefined, {
      skip: user,
    });

    const { userInfo } = useSelector((state) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
      if (!userInfo && requireLogin) {
        router.push("/login");
      }

      const effectiveUser = currentUser || user;

      if (!effectiveUser) {
        return;
      }

      if (effectiveUser && userInfo) {
        dispatch(setUser(effectiveUser));
      }
      if (requireAdmin && !effectiveUser?.isAdmin) {
        router.push("/unauthorized");
      }
    }, [userInfo, user, currentUser, requireLogin, requireAdmin, dispatch]);

    return <Component {...props} />;
  };
}
