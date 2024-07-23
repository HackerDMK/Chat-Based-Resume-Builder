import { useGoogleLogin } from "@react-oauth/google";
import axios from "../../AxiosInstance";

const Login = () => {
  if (localStorage.getItem("jwt")) {
    window.location.href = "/";
  }

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      var loginDetails = await getUserInfo(codeResponse);
      const { jwt } = loginDetails;
      localStorage.setItem("jwt", jwt);
      window.location.href = "/";
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
  });

  async function getUserInfo(codeResponse) {
    const response = await axios.post(
      "auth/google-login",
      { code: codeResponse.code }
    );
    return await response.data;
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-w-96 mx-auto"
      style={{ zIndex: 100 }}
    >
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Login
          <span className="text-blue-500"> Resume Builder</span>
        </h1>
        <p className="text-lg text-gray-300 mt-4 text-center">
          Welcome to Resume Builder. Please login to continue.
        </p>
        <div className="flex flex-col items-center justify-center mt-5">
          <button className="btn" onClick={googleLogin}>
            Login with Google
          </button>
        </div>
      </div>
    </div>
  );
};
export default Login;
