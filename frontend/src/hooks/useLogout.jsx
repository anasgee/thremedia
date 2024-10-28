import { useSetRecoilState } from "recoil";
import userAtom from "../atom/userAtom";
import useShowToast from "../hooks/showToast";

const useLogout = () => {
	const setUser = useSetRecoilState(userAtom);
	const toast = useShowToast();

	const logout = async () => {
		try {
			const res = await fetch("/api/users/signout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();

			if (data.error) {
				toast("Error", data.error, "error");
				return;
			}

			localStorage.removeItem("user-threads");
			setUser(null);
		} catch (error) {
			toast("Error", error, "error");
		}
	};
	return logout
};

export default useLogout;
