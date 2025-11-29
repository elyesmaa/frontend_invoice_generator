// Format labels like "clientName" => "Client Name"
export const formatLabel = (label) => {
  if (!label) return "";
  return label
    .replace(/([A-Z])/g, " $1")  
    .replace(/^./, (str) => str.toUpperCase())  
};
