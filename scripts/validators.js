export const descRegex = /^\S(?:.*\S)?$/;
export const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
export const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
export const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
export const duplicateRegex = /\b(\w+)\s+\1\b/i;
