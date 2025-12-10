import { useState, useCallback, useRef } from 'react';
import { useForm as useReactHookForm, FieldValues, UseFormReturn, DefaultValues, FieldErrors, Path, PathValue } from 'react-hook-form';
import { Post } from '../http/Post';

/**
 * Validation function type
 */
export type ValidateFunction<T extends FieldValues> = (values: T) => Record<string, string> | Promise<Record<string, string>>;

/**
 * Options for the useForm hook
 */
export interface UseFormOptions<T extends FieldValues> {
  /** Initial form values */
  initialValues: T;
  /** Submit handler - receives form values */
  onSubmit?: (values: T) => void | Promise<void>;
  /** Post configuration for automatic submission */
  post?: {
    url: string;
    method?: 'POST' | 'PUT' | 'PATCH';
    headers?: Record<string, string>;
    onSuccess?: (response: any) => void;
    onError?: (error: Error) => void;
  };
  /** Custom validation function */
  validate?: ValidateFunction<T>;
  /** Validation mode */
  mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all';
}

/**
 * Return type for the useForm hook
 */
export interface UseFormResult<T extends FieldValues> {
  /** Current form values */
  values: T;
  /** Form errors by field */
  errors: FieldErrors<T>;
  /** Set a single field value */
  setValue: <K extends Path<T>>(name: K, value: PathValue<T, K>) => void;
  /** Set multiple field values */
  setValues: (values: Partial<T>) => void;
  /** Submit the form */
  submit: () => Promise<void>;
  /** Whether form is submitting */
  submitting: boolean;
  /** Reset form to initial values */
  reset: (values?: T) => void;
  /** Whether form has been modified */
  isDirty: boolean;
  /** Whether form is valid */
  isValid: boolean;
  /** Register a field (for uncontrolled inputs) */
  register: UseFormReturn<T>['register'];
  /** Get field state */
  getFieldState: UseFormReturn<T>['getFieldState'];
  /** Trigger validation */
  trigger: UseFormReturn<T>['trigger'];
  /** Clear all errors */
  clearErrors: UseFormReturn<T>['clearErrors'];
  /** Set an error on a field */
  setError: UseFormReturn<T>['setError'];
  /** Watch form values */
  watch: UseFormReturn<T>['watch'];
}

/**
 * useForm - React hook for form state management
 * 
 * Wraps react-hook-form with a simplified API and optional Post integration.
 * 
 * @template T - Form values type
 * @param options - Hook options
 * @returns Hook result with form state and control functions
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const { values, setValue, submit, submitting } = useForm({
 *   initialValues: { name: '', email: '' },
 *   onSubmit: async (values) => {
 *     await saveUser(values);
 *   },
 * });
 * 
 * // With Post integration
 * const { values, submit, submitting } = useForm({
 *   initialValues: { name: '', email: '' },
 *   post: {
 *     url: '/api/users',
 *     onSuccess: (user) => navigate(`/users/${user.id}`),
 *   },
 * });
 * 
 * // With validation
 * const { values, errors, submit } = useForm({
 *   initialValues: { email: '' },
 *   validate: (values) => {
 *     const errors: Record<string, string> = {};
 *     if (!values.email.includes('@')) {
 *       errors.email = 'Invalid email';
 *     }
 *     return errors;
 *   },
 * });
 * 
 * // In JSX
 * <input
 *   value={values.name}
 *   onChange={(e) => setValue('name', e.target.value)}
 * />
 * <span>{errors.name?.message}</span>
 * <button onClick={submit} disabled={submitting}>Save</button>
 * ```
 */
export function useForm<T extends FieldValues>(
  options: UseFormOptions<T>
): UseFormResult<T> {
  const {
    initialValues,
    mode = 'onSubmit',
  } = options;

  const [submitting, setSubmitting] = useState(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Use react-hook-form under the hood
  const form = useReactHookForm<T>({
    defaultValues: initialValues as DefaultValues<T>,
    mode,
  });

  const {
    register,
    reset: rhfReset,
    formState: { errors, isDirty, isValid },
    setValue: rhfSetValue,
    getValues,
    getFieldState,
    trigger,
    clearErrors,
    setError: rhfSetError,
    watch,
  } = form;

  /**
   * Set a single field value
   */
  const setValue = useCallback(<K extends Path<T>>(name: K, value: PathValue<T, K>) => {
    rhfSetValue(name, value, { shouldValidate: true, shouldDirty: true });
  }, [rhfSetValue]);

  /**
   * Set multiple field values
   */
  const setValues = useCallback((values: Partial<T>) => {
    Object.entries(values).forEach(([key, value]) => {
      rhfSetValue(key as Path<T>, value as PathValue<T, Path<T>>, { shouldValidate: true, shouldDirty: true });
    });
  }, [rhfSetValue]);

  /**
   * Submit the form
   */
  const submit = useCallback(async () => {
    const currentOptions = optionsRef.current;
    
    // Trigger validation first
    const isFormValid = await trigger();
    if (!isFormValid) {
      return;
    }

    const values = getValues();

    // Run custom validation if provided
    if (currentOptions.validate) {
      const validationErrors = await currentOptions.validate(values);
      if (Object.keys(validationErrors).length > 0) {
        // Set errors on form
        Object.entries(validationErrors).forEach(([field, message]) => {
          rhfSetError(field as Path<T>, { type: 'validate', message });
        });
        return;
      }
    }

    setSubmitting(true);

    try {
      // Use Post if configured
      if (currentOptions.post) {
        const postInstance = new Post()
          .target(currentOptions.post.url)
          .method(currentOptions.post.method || 'POST')
          .body(values);

        if (currentOptions.post.headers) {
          postInstance.headers(currentOptions.post.headers);
        }

        const response = await postInstance.execute();
        currentOptions.post.onSuccess?.(response);
      } else if (currentOptions.onSubmit) {
        // Use onSubmit callback
        await currentOptions.onSubmit(values);
      }
    } catch (error) {
      if (currentOptions.post?.onError) {
        currentOptions.post.onError(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    } finally {
      setSubmitting(false);
    }
  }, [trigger, getValues, rhfSetError]);

  /**
   * Reset form to initial or provided values
   */
  const reset = useCallback((values?: T) => {
    rhfReset(values ?? initialValues as DefaultValues<T>);
  }, [rhfReset, initialValues]);

  // Get current values (reactive)
  const values = watch();

  return {
    values: values as T,
    errors,
    setValue,
    setValues,
    submit,
    submitting,
    reset,
    isDirty,
    isValid,
    register,
    getFieldState,
    trigger,
    clearErrors,
    setError: rhfSetError,
    watch,
  };
}
