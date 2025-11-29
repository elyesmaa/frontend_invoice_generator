import React, { useState } from "react";
import { FileText, Mail, ArrowRight, Check, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../validation/loginValidationSchemas";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from '../../services';
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);
    try {
      // Minimum loading time of 1 second
      const [res] = await Promise.all([
        authService.login(data),
        new Promise(resolve => setTimeout(resolve, 1000))
      ]);

      const token = res.data.token;
      const user = res.data;
      login(user, token);
      setSuccess("Login successful !");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setServerError(err.response.data.message);
      } else if (err.response) {
        setServerError("Invalid email or password.");
      } else {
        setServerError("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Left Panel: Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-950 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Quick Invoice</h2>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
            <p className="text-gray-600">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              icon={Mail}
              error={errors.email?.message}
              {...register("email")}
              disabled={isLoading || success}
            />

            <div className="space-y-1">
              <PasswordInput
                id="password"
                label="Password"
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register("password")}
                disabled={isLoading || success}
              />
              <div className="flex justify-end">
                <button type="button" className="text-sm text-blue-950 font-medium hover:underline" disabled={isLoading || success}>
                  Forgot password?
                </button>
              </div>
            </div>

            {serverError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{serverError}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              isLoading={isLoading}
              disabled={isLoading || success}
              className="w-full group"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="font-semibold">{isLoading ? "Signing in..." : "Sign In"}</span>
                {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-200" />}
              </span>
            </Button>

            {success && (
              <div className="text-center py-4 animate-fadeIn">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Login Successful!</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Redirecting...</span>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                className="text-blue-950 font-semibold hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Blue Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-8 lg:p-12 flex-col justify-between relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-700 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8 lg:mb-12">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white text-lg lg:text-xl font-bold">Quick Invoice</h2>
              <p className="text-blue-200 text-xs lg:text-sm">Professional Invoicing Platform</p>
            </div>
          </div>

          <div className="mb-8 lg:mb-10">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4 leading-tight">
              Manage your business<br />from anywhere
            </h1>
            <p className="text-blue-100 text-base lg:text-lg">
              Access your dashboard, track payments, and manage clients on the go.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <p className="text-blue-50 italic mb-4">
              "Quick Invoice has completely transformed how I handle my business finances. It's intuitive, fast, and professional."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-blue-950 font-bold">
                JD
              </div>
              <div>
                <p className="text-white font-semibold">John Doe</p>
                <p className="text-blue-200 text-sm">Freelance Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Login;
