export function Card({ children, className = "" }) {
    return (
      <div className={`rounded-lg shadow-md border p-6 bg-white ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={`mt-2 ${className}`}>{children}</div>;
  }