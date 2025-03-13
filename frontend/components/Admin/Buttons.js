import React from "react";

const Buttons = ({ color, text, textColor, padding, bRadius }) => {
  const buttonStyle = {
    backgroundColor: color,
    color: textColor,
    padding: padding,
    borderRadius: bRadius,
  };
  return <button style={buttonStyle}>{text}</button>;
};

export default Buttons;
