import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export interface NotificationParams {
    type?: "error" | "success" | "warning";
    message?: string;
}

export const notify = (params: NotificationParams) => {
    switch (params.type) {
        case "error":
            toast.error(params.message);
            break;
        case "success":
            toast.success(params.message);
            break;
        case "warning":
            toast.warn(params.message);
            break;
        default:
            toast.warn("Někde nastala chyba");
            break;
    }
}
export default notify;