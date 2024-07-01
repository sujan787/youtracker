import { useEffect, useState } from 'react'

import { ToastAction } from '@radix-ui/react-toast';
import { useToast } from './use-toast';

interface UseToastMessageProps { error?: string, success?: string }

const useToastMessage = () => {
    const { toast } = useToast()
    const [toasterMessage, setToasterMessage] = useState<UseToastMessageProps>();

    useEffect(() => {
        if (!toasterMessage) return;

        if (toasterMessage.error) {
            toast({
                variant: "destructive",
                color: "red",
                title: "Uh oh! Something went wrong. 😢",
                description: toasterMessage.error,
                action: <ToastAction className='border rounded-md px-2 py-1' altText="Try again">Try again</ToastAction>,
            })
        }

        if (toasterMessage.success) {
            toast({
                variant: "destructive",
                title: "Hey do you know 🙂",
                description: toasterMessage.success,
                action: (
                    <ToastAction className='border rounded-md px-2 py-1' altText="Goto schedule to undo">Undo</ToastAction>
                ),
            })
        }

        setToasterMessage(undefined)

    }, [toasterMessage]);

    return [setToasterMessage]
}

export default useToastMessage