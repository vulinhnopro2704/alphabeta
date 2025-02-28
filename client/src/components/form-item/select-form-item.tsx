import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { FormFieldProps } from './common-type';

export default function SelectFormItem({ field, label }: FormFieldProps) {
    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
                {...field}
                onValueChange={field.onChange}
                defaultValue={field.value}
            >
                <FormControl>
                    <SelectTrigger className="w-full min-w-30 px-4 py-2 border">
                        <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
            </Select>
            {/* <FormDescription>{description}</FormDescription> */}
            <FormMessage />
        </FormItem>
    );
}
