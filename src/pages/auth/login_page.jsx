import { useState } from "react";
import LoginForm from "./loginform";
import RegistrationForm from "./registrationform";
import bg_image from '../../assets/bg_image.jpg'; // Update this with your image path
import toggleImage from '../../assets/ysslogo.png'; // Image to be placed on toggle option

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${bg_image})`,
      }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        
        {/* Image on top of the Toggle */}
        <div className="mb-4">
          <img src={toggleImage} alt="Login/Register Toggle" className="mx-auto w-24 h-24 object-cover rounded-full border-4 border-orange-600" />
        </div>
        
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-4 border-b-2 pb-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 w-1/2 rounded-l-lg ${
              isLogin ? "bg-orange-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 w-1/2 rounded-r-lg ${
              !isLogin ? "bg-orange-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Rendering */}
        <div className="p-4">
          {isLogin ? <LoginForm /> : <RegistrationForm />}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
