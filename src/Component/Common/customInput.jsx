import React from "react";
import { Grid, TextField } from "@mui/material";

const CustomInput = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  name,
  ...rest
}) => {
  return (
    <Grid item {...rest}>
      <TextField
        type={type}
        label={label}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
        fullWidth
        required
      />
    </Grid>
  );
};

export default CustomInput;
