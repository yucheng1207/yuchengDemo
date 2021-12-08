import React, { FC, ReactNode } from "react";

interface Props
{
    text?: string | ReactNode
}

const Button: FC<Props> = (props) => <button>{props.text || 'App 2 Button'}</button>;

export default Button;
