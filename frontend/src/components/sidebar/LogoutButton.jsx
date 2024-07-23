import { BiLogOut } from "react-icons/bi";

const LogoutButton = () => {
  const logout = () => {
    window.localStorage.removeItem("jwt");
    window.location.href = "/auth";
  };

  return (
    <div className="mt-auto">
      <BiLogOut
        className="w-6 h-6 text-white cursor-pointer"
        onClick={logout}
      />
    </div>
  );
};
export default LogoutButton;
