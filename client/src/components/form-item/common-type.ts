import { ControllerRenderProps } from 'react-hook-form';

export interface FormFieldProps {
    label: string;
    field: ControllerRenderProps<any>;
    description?: string;
}
