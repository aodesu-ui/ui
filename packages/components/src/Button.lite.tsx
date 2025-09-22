// src/Button.lite.tsx
export default function Button(props: any) {
  const variant = props.variant || "contained";
  const color = props.color || "primary";

  // Estilos por defecto embebidos
  const defaultStyles = {
    contained: {
      primary: {
        background: "#2563eb",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "500",
      },
      secondary: {
        background: "#64748b",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "500",
      },
      success: {
        background: "#16a34a",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "500",
      },
      error: {
        background: "#dc2626",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    outlined: {
      primary: {
        background: "transparent",
        color: "#2563eb",
        border: "1px solid #2563eb",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "500",
      },
      secondary: {
        background: "transparent",
        color: "#64748b",
        border: "1px solid #64748b",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    text: {
      primary: {
        background: "transparent",
        color: "#2563eb",
        border: "none",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "500",
      },
      secondary: {
        background: "transparent",
        color: "#64748b",
        border: "none",
        borderRadius: "6px",
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
  };

  // Obtener estilos base
  let buttonStyle = {};
  if (defaultStyles[variant] && defaultStyles[variant][color]) {
    buttonStyle = defaultStyles[variant][color];
  } else {
    buttonStyle = defaultStyles.contained.primary;
  }

  // Aplicar estilos adicionales
  const finalStyle = Object.assign({}, buttonStyle, {
    cursor: props.disabled ? "not-allowed" : "pointer",
    opacity: props.disabled ? "0.6" : "1",
    transition: "all 0.2s ease-in-out",
    fontFamily: "inherit",
    outline: "none",
  });

  // Agregar estilos del prop style si existen
  if (props.style) {
    Object.assign(finalStyle, props.style);
  }

  // Aplicar props adicionales
  if (props.fullWidth) {
    finalStyle.width = "100%";
  }

  // Estilos de tamaño
  if (props.size === "small") {
    finalStyle.padding = "4px 8px";
    finalStyle.fontSize = "12px";
  } else if (props.size === "large") {
    finalStyle.padding = "12px 24px";
    finalStyle.fontSize = "16px";
  }

  return (
    <button
      type={props.type || "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      style={finalStyle}
      className={props.className}
    >
      {props.children}
    </button>
  );
}
