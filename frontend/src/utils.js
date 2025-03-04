export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
export function formatDate(date) {
  const d = new Date(date);
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // getMonth() is zero-based, so we add 1
  const day = String(d.getDate()).padStart(2, '0'); // Ensure the day is two digits

  return `${year}-${month}-${day}`;
}
