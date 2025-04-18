interface TextareaProps {
    name: string
    defaultValue: string
    placeholder?: string
    rows?: number
  }
  
  const Textarea = ({ name, defaultValue, placeholder, rows = 4 }: TextareaProps) => {
    return (
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )
  }
  
  export { Textarea }