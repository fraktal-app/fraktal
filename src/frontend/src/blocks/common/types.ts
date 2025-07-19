export type InputField =
  | {
      key: string
      label: string
      placeholder: string
      type: "text" | "password" | "textarea"
      required?: boolean
      maxLength?: number
    }
  | {
      key: string
      label: string
      placeholder: string
      type: "select"
      required?: boolean
      options: Array<{ value: string; label: string }>
    }