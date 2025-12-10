/**
 * Form field and validation types
 */

export type FieldValue = string | number | boolean | Date | null | undefined | any[] | any;

export interface ValidationRule {
  required?: boolean;
  message?: string;
  pattern?: RegExp;
  min?: number;
  max?: number;
  validator?: (value: FieldValue) => boolean | string | Promise<boolean | string>;
}

export interface FormFieldConfig {
  key: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  tooltip?: string;
  rules?: ValidationRule[];
  defaultValue?: FieldValue;
}

export type FormValues = Record<string, FieldValue>;

export interface FormConfig<T extends FormValues = FormValues> {
  initialValues?: Partial<T>;
  onSubmit?: (values: T) => void | Promise<void>;
  onValidate?: (values: T) => Record<string, string> | Promise<Record<string, string>>;
}
