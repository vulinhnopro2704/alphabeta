import { FormControl, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { PopoverContent } from '../ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { FormFieldProps } from './common-type';
import { CustomCalendar } from '../ui/calendar';

export default function CalendarFormItem({ field, label }: FormFieldProps) {
    return (
        <FormItem className="flex flex-col">
            <FormLabel className="text-white">{label}</FormLabel>
            <Popover>
                <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                            variant={'outline'}
                            className={cn(
                                'w-[240px] pl-3 text-left font-normal text-white bg-gray-800 hover:bg-gray-700 border-gray-600 hover:text-white',
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
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600">
                    <CustomCalendar
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
            <FormMessage className="text-white" />
        </FormItem>
    );
}
