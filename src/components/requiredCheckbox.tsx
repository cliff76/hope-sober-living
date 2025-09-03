import {useCallback} from "react";

type RequiredCheckboxProps = {
    label: string,
    name: string,
    checked?: boolean,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    invalidMessage: string,
    required?: boolean,
    disabled?: boolean,
    className?: string,
};

export function RequiredCheckbox({
                                     label,
                                     name,
                                     checked,
                                     onChange,
                                     invalidMessage,
                                     required,
                                     disabled,
                                     className
                                 }: RequiredCheckboxProps) {
    const changeEvent = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        event.target.setCustomValidity((event.target.checked) ? "" : invalidMessage);
        onChange?.(event);
    }, [invalidMessage, onChange]);
    return <div className="flex items-center">
        <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={changeEvent}
            onInvalid={(e: React.FormEvent<HTMLInputElement>) => e.currentTarget.setCustomValidity((checked) ? "" : invalidMessage)}
            required={required}
            disabled={disabled}
            className={className}
        />
        <label htmlFor={name} className="ml-2 text-sm text-gray-600">{label}</label>
    </div>;
}