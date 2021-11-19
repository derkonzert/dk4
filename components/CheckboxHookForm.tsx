import { CheckIcon } from "@radix-ui/react-icons";
import { useController } from "react-hook-form";
import { Checkbox, CheckboxIndicator } from "./CheckBox";

export function CheckboxHookForm({
  control,
  setValue,
  name,
  required = false,
}) {
  const {
    field: { ref, value, onChange, ...inputProps },
    //   fieldState: { invalid, isTouched, isDirty },
    //   formState: { touchedFields, dirtyFields
  } = useController({
    name,
    control,
    rules: { required },
  });

  return (
    <Checkbox
      {...inputProps}
      checked={value}
      onCheckedChange={(isChecked) => setValue(name, isChecked)}
      ref={ref}
      id={name}
    >
      <CheckboxIndicator>
        <CheckIcon />
      </CheckboxIndicator>
    </Checkbox>
  );
}
