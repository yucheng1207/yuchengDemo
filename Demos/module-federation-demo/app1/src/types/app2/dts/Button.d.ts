import { FC, ReactNode } from "react";
export interface ButtonProps {
    text?: string | ReactNode;
    className?: string;
}
export declare const Button: FC<ButtonProps>;
export default Button;
