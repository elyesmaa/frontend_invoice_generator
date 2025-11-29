import { toast } from "react-hot-toast";

export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-center",
    duration: 3000,
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: "top-center",
    duration: 3000,
  });
};

export const showInfo = (message) => {
  toast(message, {
    position: "top-center",
    duration: 3000,
  });
};
