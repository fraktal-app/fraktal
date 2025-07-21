export type InputField =
  | {
      key: string;
      label: string;
      placeholder: string;
      type: "text" | "password" | "textarea";
      required?: boolean;
      maxLength?: number;
      allowDataMapping?: boolean;
      description?: string;
      conditional?: {
        basedOn: 'triggerApp';
        appType: string;
        pill: string;
        pillLabel: string;
      };
    }
  | {
      key: string;
      label: string;
      placeholder: string;
      type: "select";
      required?: boolean;
      options: Array<{ value: string; label: string }>;
      allowDataMapping?: boolean;
      description?: string;
      conditional?: {
        basedOn: 'triggerApp';
        appType: string;
        pill: string;
        pillLabel: string;
      };
    };