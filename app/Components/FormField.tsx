import React, { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Mail,
  Lock,
  User,
  FileText
} from 'lucide-react';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  type?: "text" | "email" | "password" | "file" | "tel" | "url";
  description?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  showIcon?: boolean;
}

const FormField = <T extends FieldValues>({
  name,
  control,
  placeholder,
  label,
  type = "text",
  description,
  className,
  disabled = false,
  required = false,
  showIcon = true,
}: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getFieldIcon = () => {
    if (!showIcon) return null;
    
    switch (type) {
      case 'email':
        return <Mail size={18} className="text-gray-400" />;
      case 'password':
        return <Lock size={18} className="text-gray-400" />;
      case 'file':
        return <FileText size={18} className="text-gray-400" />;
      case 'tel':
        return <User size={18} className="text-gray-400" />;
      default:
        if (name === 'name') return <User size={18} className="text-gray-400" />;
        return <FileText size={18} className="text-gray-400" />;
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error;
        const isValid = !hasError && field.value && field.value.length > 0;

        return (
          <FormItem className={cn("space-y-2", className)}>
            {label && (
              <FormLabel className={cn(
                "text-sm font-medium transition-colors duration-200",
                hasError ? "text-red-600" : 
                isValid ? "text-green-600" : 
                isFocused ? "text-blue-600" : "text-gray-700"
              )}>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            )}
            
            <FormControl>
              <div className="relative">
                {/* Left Icon */}
                {showIcon && (
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                    {getFieldIcon()}
                  </div>
                )}
                
                {/* Input Field */}
                <Input
                  {...field}
                  type={type === 'password' && showPassword ? 'text' : type}
                  placeholder={placeholder}
                  disabled={disabled}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={cn(
                    "w-full transition-all duration-200 text-gray-900",
                    showIcon && "pl-11",
                    type === 'password' && "pr-11",
                    hasError
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : isValid
                      ? "border-green-300 focus:border-green-500 focus:ring-green-500/20"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
                    "bg-white/80 backdrop-blur-sm rounded-xl py-3 px-4",
                    "placeholder:text-gray-400",
                    disabled && "opacity-50 cursor-not-allowed bg-gray-50"
                  )}
                />
                
                {/* Password Toggle */}
                {type === 'password' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
                
                {/* Validation Icons */}
                {!disabled && type !== 'password' && field.value && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {hasError ? (
                      <AlertCircle size={18} className="text-red-500" />
                    ) : isValid ? (
                      <CheckCircle size={18} className="text-green-500" />
                    ) : null}
                  </div>
                )}
                
                {/* Focus Ring */}
                <div className={cn(
                  "absolute inset-0 rounded-xl pointer-events-none transition-all duration-200",
                  isFocused && !hasError && "ring-2 ring-blue-500/20",
                  hasError && "ring-2 ring-red-500/20",
                  isValid && "ring-2 ring-green-500/20"
                )} />
              </div>
            </FormControl>
            
            {/* Description */}
            {description && (
              <FormDescription className="text-sm text-gray-600">
                {description}
              </FormDescription>
            )}
            
            {/* Error Message */}
            <FormMessage className="text-sm text-red-600 flex items-center space-x-1">
              {fieldState.error && (
                <>
                  <AlertCircle size={14} />
                  <span>{fieldState.error.message}</span>
                </>
              )}
            </FormMessage>
            
            {/* Success Message */}
            {isValid && !fieldState.error && (
              <div className="text-sm text-green-600 flex items-center space-x-1">
                <CheckCircle size={14} />
                <span>Looks good!</span>
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
};

export default FormField;
