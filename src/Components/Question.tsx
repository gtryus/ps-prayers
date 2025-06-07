import TextField from "@mui/material/TextField";
import React from "react";

interface IProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function Question(props: IProps) {
  const [question, setQuestion] = React.useState(props.value || "");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };

    React.useEffect(() => {
        if (props.value) {
        setQuestion(props.value);
        }
    }, [props.value]);

  return (
    <TextField
      id="outlined-basic"
      label={props.label || "Question"}
      fullWidth
      variant="outlined"
      multiline
      rows={4}
      onChange={handleChange}
      value={question}
    />
  );
}
