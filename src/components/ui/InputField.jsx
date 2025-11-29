const InputField = ({ icon: Icon, label, name, error, required, className = '', ...props }) => {
  return (
    <div className='mb-3'>
      <label
        className='block text-sm font-medium text-slate-700 mb-2'
        htmlFor={name}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className='relative'>
        {Icon && (
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Icon className="w-5 h-5 text-slate-400" />
          </div>
        )}

        <input
          id={name}
          name={name}
          {...props}
          className={`w-full h-10 pr-3 py-2 border rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${Icon ? 'pl-10' : 'pl-3'
            } ${error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:ring-blue-500'
            } ${className}`}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default InputField
