import { useField } from "formik"
import React from "react"
import { Form, Label } from "semantic-ui-react"
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

interface CustomDateInputProps extends Partial<ReactDatePickerProps> {
    disablePast?: boolean;
}

export default function CustomDateInput({ disablePast, ...props }: CustomDateInputProps) {
    const [field, meta, helpers] = useField(props.name!)

    const minDate = disablePast ? new Date(new Date().setHours(0, 0, 0, 0)) : undefined;
    
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <DatePicker 
                {...field}
                {...props}
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value)}
                minDate={minDate}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}
