function ErrorAlert({ message, title = "Error", onClose }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between items-start">
      <div>
        {title && <h3 className="font-bold text-red-800 mb-1">{title}</h3>}
        <p className="text-red-700">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-red-600 hover:text-red-800">
          ✕
        </button>
      )}
    </div>
  )
}
export default ErrorAlert