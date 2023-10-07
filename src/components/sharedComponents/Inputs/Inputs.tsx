import React, { forwardRef } from 'react';
import { TextField } from '@mui/material';


interface inputState {
    name: string,
    placeholder: string;

}

export const InputText = forwardRef((props: inputState, ref) => {
    return (
        <TextField
            variant = 'outlined'
            margin = 'normal'
            inputRef = {ref}
            fullWidth
            type = 'text'
            {...props}
        >
        </TextField>
    )
})

export const InputPassword = forwardRef((props: inputState, ref) => {
    return (
        <TextField
            variant = 'outlined'
            margin = 'normal'
            inputRef = {ref}
            fullWidth
            type = 'password'
            {...props}
        >
        </TextField>
    )
})