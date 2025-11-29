import React, { useState } from "react";
import { FileText, Mail, ArrowRight, User, Building2, Phone, MapPin, Check, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../../validation/registerValidationSchemas";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from '../../services';
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { register, handleSubmit, formState: { errors }, trigger, setError, getValues } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onChange"
  });

  const nextStep = async () => {
    const isValid = await trigger(["name", "email", "password", "confirmPassword"]);
    if (isValid) {
      try {
        const email = getValues("email");
        const res = await authService.checkEmail(email);

        if (res.exists) {
          setError("email", {
            type: "manual",
            message: "Email already exists"
          });
          return;
        }

        setServerError("");
        setCurrentStep(2);
      } catch (error) {
        console.error("Email check failed", error);
        setServerError("Could not verify email. Please try again.");
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  const onSubmit = async (data) => {
    setServerError("");
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = data;
      await authService.signup(userData);
      // No login here, wait for verification

      setIsSuccess(true);
    } catch (err) {
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err.response) {
        setServerError("Registration failed. Please try again.");
      } else {
        setServerError("Network error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Left Panel */}
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
              Welcome to the future<br />of invoicing
            </h1>
            <p className="text-blue-100 text-base lg:text-lg">
              Create, manage, and track your invoices with ease.
            </p>
          </div>

          <div className="space-y-3 lg:space-y-4">
            {[
              "Unlimited invoices and clients",
              "Professional templates included",
              "Real-time invoice tracking",
              "Secure and reliable platform"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0 border border-white/20">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-white text-sm lg:text-base font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-blue-200 text-xs lg:text-sm">
            Trusted by over 10,000+ businesses worldwide
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-md lg:max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-950 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Quick Invoice</h2>
          </div>

          {isSuccess ? (
            <div className="text-center animate-fadeIn">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Created!</h2>
              <p className="text-gray-600 text-lg mb-8">
                Your account has been successfully created.<br />
                Please check your email to verify your account before logging in.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              {/* Header with Step Indicators */}
              <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Create your account</h1>

                <div className="flex items-center gap-3">
                  {/* Step 1 */}
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${currentStep === 1 ? 'bg-blue-950 text-white shadow-lg' : 'bg-blue-100 text-blue-950'
                      }`}>
                      1
                    </div>
                    <span className={`text-sm font-medium hidden sm:inline ${currentStep === 1 ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                      Personal Info
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="flex-1 h-0.5 bg-gray-200 max-w-[60px]">
                    <div
                      className="h-full bg-blue-950 transition-all duration-300"
                      style={{ width: currentStep === 2 ? '100%' : '0%' }}
                    ></div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${currentStep === 2 ? 'bg-blue-950 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
                      }`}>
                      2
                    </div>
                    <span className={`text-sm font-medium hidden sm:inline ${currentStep === 2 ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                      Business Details
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Step 1 */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        id="name"
                        type="text"
                        label="Full Name"
                        placeholder="John Doe"
                        icon={User}
                        error={errors.name?.message}
                        {...register("name")}
                      />
                      <Input
                        id="email"
                        type="email"
                        label="Email"
                        placeholder="john@example.com"
                        icon={Mail}
                        error={errors.email?.message}
                        {...register("email")}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <PasswordInput
                        id="password"
                        label="Password"
                        placeholder="Min. 8 characters"
                        error={errors.password?.message}
                        {...register("password")}
                      />
                      <PasswordInput
                        id="confirmPassword"
                        label="Confirm Password"
                        placeholder="Re-enter password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="large"
                        onClick={nextStep}
                        className="w-full group"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span className="font-semibold">Continue to Business Details</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-200" />
                        </span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <Input
                      id="businessName"
                      type="text"
                      label="Business Name"
                      placeholder="Your Company Ltd."
                      icon={Building2}
                      error={errors.businessName?.message}
                      {...register("businessName")}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        id="phone"
                        type="tel"
                        label="Phone"
                        placeholder="+1 234 567 8900"
                        icon={Phone}
                        error={errors.phone?.message}
                        {...register("phone")}
                      />
                      <Input
                        id="address"
                        type="text"
                        label="Address"
                        placeholder="123 Main St"
                        icon={MapPin}
                        error={errors.address?.message}
                        {...register("address")}
                      />
                    </div>

                    {serverError && (
                      <div className="p-3 lg:p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm">{serverError}</p>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="large"
                        onClick={prevStep}
                        className="w-full sm:w-auto group"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-200" />
                          <span className="font-semibold">Back</span>
                        </span>
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        disabled={isLoading}
                        className="flex-1 group hover:scale-[1.02]"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <span className="font-semibold">{isLoading ? "Creating account..." : "Create Account"}</span>
                          {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-200" />}
                        </span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sign In Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-blue-950 font-semibold hover:underline"
                      onClick={() => navigate("/login")}
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </form>

              {/* Terms */}
              <p className="mt-4 lg:mt-6 text-xs text-center text-gray-500">
                By creating an account, you agree to our{" "}
                <a href="#" className="text-blue-950 hover:underline">Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-blue-950 hover:underline">Privacy Policy</a>
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
