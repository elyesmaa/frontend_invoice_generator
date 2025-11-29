import React from "react";
import { X, AlertTriangle } from "lucide-react";
import Button from "./Button";

const GenericModal = ({
  isOpen,
  title,
  description,
  icon,
  onClose,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  hideConfirm = false,
  hideCancel = false,
  confirmBtnClass = "bg-red-600 hover:bg-red-700 text-white",
  cancelBtnClass = "border border-slate-300 text-slate-600 hover:bg-slate-100"
}) => {
  if (!isOpen) return null;

  const IconComponent = icon || AlertTriangle;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-slate-700 leading-relaxed">{description}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end gap-3">
          {!hideCancel && (
            <Button
              variant="outline"
              onClick={onClose}
            >
              {cancelText}
            </Button>
          )}

          {!hideConfirm && (
            <Button
              variant="danger"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericModal;
