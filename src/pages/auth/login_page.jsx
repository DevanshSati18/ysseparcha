import { useState } from "react";
import LoginForm from "./loginform";
import RegistrationForm from "./registrationform";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://source.unsplash.com/random/1600x900')",
      }}
    >
      <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {isLogin ? "Login" : "Register"}
        </h1>

        {isLogin ? <LoginForm /> : <RegistrationForm />}

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 text-blue-500 hover:underline"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
