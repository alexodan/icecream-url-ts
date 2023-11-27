import { ComponentPropsWithoutRef } from "react";

type FieldProps = {
  label: string;
} & ComponentPropsWithoutRef<"input">;

export function FieldText({ id, label, onBlur, ...rest }: FieldProps) {
  return (
    <label id={id}>
      <div>{label}</div>
      <input type="text" onBlur={onBlur} {...rest} />
    </label>
  );
}

export function FieldCheckbox({ name, value, label, ...rest }: FieldProps) {
  return (
    <label htmlFor={name}>
      <input type="checkbox" name={name} value={value} {...rest} />
      <span>{label}</span>
    </label>
  );
}

export function FieldRadio({ name, value, label, ...rest }: FieldProps) {
  return (
    <label htmlFor={name}>
      <input type="radio" name={name} value={value} {...rest} />
      <span>{label}</span>
    </label>
  );
}
