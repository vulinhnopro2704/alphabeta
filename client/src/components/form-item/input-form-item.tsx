import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { FormFieldProps } from './common-type';

interface InputFormItemProps extends FormFieldProps {
    type?: string;
}

export default function InputFormItem({
    field,
    label,
    type = 'text',
}: InputFormItemProps) {
    return (
        <FormItem>
            <FormLabel className="block mb-3">{label}</FormLabel>
            <FormControl>
                <Input
                    type={type}
                    className="px-2 py-3"
                    placeholder="Nhập địa chỉ email của bạn"
                    {...field}
                />
            </FormControl>
            {/* <FormDescription>{description}</FormDescription> */}
            <FormMessage />
        </FormItem>
    );
}
