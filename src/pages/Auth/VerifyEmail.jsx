import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { authService } from "../../services";
import Button from "../../components/ui/Button";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus("error");
                setMessage("Invalid verification link.");
                return;
            }

            try {
                await authService.verifyEmail(token);
                setStatus("success");
                setMessage("Email verified successfully! You can now login.");
            } catch (error) {
                setStatus("error");
                setMessage(error.response?.data?.message || "Verification failed. The link may be invalid or expired.");
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                {status === "verifying" && (
                    <div className="animate-fadeIn">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h2>
                        <p className="text-gray-600">Please wait while we verify your email address...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="animate-fadeIn">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                        <p className="text-gray-600 mb-8">{message}</p>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/login")}
                            className="w-full group"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <span>Continue to Login</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                    </div>
                )}

                {status === "error" && (
                    <div className="animate-fadeIn">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-gray-600 mb-8">{message}</p>
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/signup")}
                            className="w-full"
                        >
                            Back to Sign Up
                        </Button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default VerifyEmail;
