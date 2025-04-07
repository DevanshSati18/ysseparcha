import { useState } from "react";
import LoginForm from "./loginform";
import RegistrationForm from "./registrationform";
import bg_image from '../../assets/bg_image.jpg';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${bg_image})`,
      }}
    >
      <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <div className="flex justify-center mb-6 border-b-2 pb-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 w-1/2 rounded-l-lg ${
              isLogin ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 w-1/2 rounded-r-lg ${
              !isLogin ? "bg-orange-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        <div className="p-4">
          {isLogin ? <LoginForm /> : <RegistrationForm />}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
