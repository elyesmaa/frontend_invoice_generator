const NavigationItem = ({ item, isActive, onClick, isCollapsed }) => {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-100 cursor-pointer
        ${isActive ? 'bg-blue-50 text-blue-900 shadow-sm shadow-blue-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-900' : 'text-gray-500'}`} />
      {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
    </button>
  );
};

export default NavigationItem;
