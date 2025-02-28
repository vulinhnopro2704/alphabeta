import {
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from '../ui/form';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { PopoverContent } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FormFieldProps } from './common-type';

export default function CalendarFormItem({
    field,
    label,
    description,
}: FormFieldProps) {
    return (
        <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={'outline'}
                            className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                            )}
                        >
                            {field.value ? (
                                format(field.value, 'PPP')
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <FormDescription>{description}</FormDescription>
            <FormMessage />
        </FormItem>
    );
}
