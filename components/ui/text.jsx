export function Title({ children, className }) {
  return (
    <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 leading-tight ${className || ""}`}>
      {children}
    </h1>
  );
}

export function SubTitle({ children, className }) {
  return (
    <h3 className={`text-lg font-bold text-gray-900 ${className || ""}`}>
      {children}
    </h3>
  );
}

export function SubText({ children, className }) {
  return (
    <p className={`text-sm leading-relaxed text-gray-600 ${className || ""}`}>
      {children}
    </p>
  );
}
