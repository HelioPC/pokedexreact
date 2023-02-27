import Swal from 'sweetalert2';

type AlertProps = {
    title: string;
    description: string;
    link?: string;
    message?: string;
    confirm?: () => void;
}

export const AlertError = ({ title, description }: AlertProps) => {
    Swal.fire({
        title: title,
        icon: "error",
        text: description,
    })
}

export const AlertSuccess = ({ title, description, confirm }: AlertProps) => {
    Swal.fire({
        title: title,
        icon: "success",
        text: description,
    }).then(confirm).catch(function (error) {console.log(error)});
}