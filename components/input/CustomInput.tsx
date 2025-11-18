"use client";
import React from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FormFieldTypes } from "@/lib/utils";
import Image from "next/image";
import { Calendar, Eye, EyeOff, Lock, Mail } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldTypes;
  name: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time";
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  label?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field: any; props: CustomProps }) => {
  const {
    name,
    type,
    placeholder,
    iconSrc,
    iconAlt,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
    disabled,
  } = props;
  const [showPassword, setShowPassword] = React.useState(false);

  switch (props.fieldType) {
    case FormFieldTypes.INPUT:
      const isPasswordType = type === "password";
      return (
        <div className="flex items-center gap-2 border rounded border-slate-300 bg-white px-4 h-11 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
          {iconSrc && (
            type === "email" ? <Mail className="h-5 w-5 text-slate-400" /> : <Lock className="h-5 w-5 text-slate-400" />
          )}
          <FormControl className="flex-1">
            <Input
              type={
                isPasswordType
                  ? showPassword
                    ? "text"
                    : "password"
                  : type || "text"
              }
              placeholder={placeholder}
              {...field}
              disabled={disabled}
              className="border-0 bg-transparent p-0 h-full w-full focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900 placeholder:text-slate-400 "
            />
          </FormControl>
          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      );

    case FormFieldTypes.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            disabled={disabled}
            className="min-h-[100px] rounded border-slate-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
          />
        </FormControl>
      );

    case FormFieldTypes.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            placeholder={placeholder}
            value={field.value}
            onChange={field.onChange}
            defaultCountry="NG"
            international
            withCountryCallingCode
            className="phone-input rounded-xl border border-slate-300 px-4 h-11 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500"
          />
        </FormControl>
      );

    case FormFieldTypes.DATE_PICKER:
      return (
        <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 h-11 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
          <Calendar className="h-5 w-5 text-slate-400" />
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat={dateFormat ?? "MM/dd/yyyy"}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker-wrapper"
              className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:outline-none w-full text-slate-900"
            />
          </FormControl>
        </div>
      );

    case FormFieldTypes.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="h-11 rounded-xl border-slate-300 bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="rounded-xl bg-white">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldTypes.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    case FormFieldTypes.CHECKBOX:
      return (
        <div className="flex items-center gap-3">
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
            className="h-5 w-5 rounded border-slate-300 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
          />
          <label
            htmlFor={name}
            className="text-sm font-medium text-slate-700 cursor-pointer"
          >
            {props.label}
          </label>
        </div>
      );

    default:
      return null;
  }
};

const CustomInput = (props: CustomProps) => {
  const { control, name, fieldType, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1 space-y-2">
          {fieldType !== FormFieldTypes.CHECKBOX && label && (
            <FormLabel className="text-sm font-medium text-slate-700">
              {label}
            </FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage className="text-sm text-red-600" />
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
