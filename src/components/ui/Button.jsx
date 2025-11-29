import { Loader2 } from "lucide-react";

const Button = ({
  variant = "primary",
  size = "medium",
  isLoading = false,
  children,
  icon: Icon,
  iconPosition = "left",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center gap-2 justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-950 to-blue-900 hover:from-blue-900 hover:to-blue-800 text-white focus:ring-blue-800 shadow-md hover:shadow-xl active:scale-95",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 focus:ring-gray-300 shadow-sm hover:shadow-md active:scale-95",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-300 active:scale-95",
    outline: "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 focus:ring-gray-300 shadow-sm hover:shadow-md active:scale-95",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500 shadow-md hover:shadow-xl active:scale-95",
  };

  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    sm: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2.5 text-sm",
    large: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {children}
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};

export default Button;
