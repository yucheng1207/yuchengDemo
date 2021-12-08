import React, { FC, ReactNode } from "react";

export interface ButtonProps
{
    text?: string | ReactNode
}

export const Button: FC<ButtonProps> = (props) => <button>{props.text || 'App 2 Button'}</button>;

export default Button;
