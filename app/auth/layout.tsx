export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#1c1917] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Atmospheric Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  );
}
