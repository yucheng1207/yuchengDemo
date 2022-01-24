import React, { FC, ReactNode, useEffect } from "react";
import styles from './button.module.scss';

export interface ButtonProps
{
    text?: string | ReactNode,
    className?: string,
}

export const Button: FC<ButtonProps> = (props) =>
{
    useEffect(() =>
    {
        console.log('Remote Button Loaded!')
    }, [])

    return <button className={`${styles.btn} ${props.className}`}>{props.text || props.children || 'App 2 Button'}</button>
}

export default Button;
