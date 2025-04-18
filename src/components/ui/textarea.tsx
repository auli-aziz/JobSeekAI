interface TextareaProps {
  id?: string
  name: string
  value?: string
  defaultValue?: string
  placeholder?: string
  rows?: number
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
}
  
  const Textarea = ({ name, ...rest }: TextareaProps) => {
    return (
      <textarea
        name={name}
        {...rest} // ✅ allows id, value, onChange, etc.
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )
  }
  
  export { Textarea }