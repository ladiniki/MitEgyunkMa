const Bubbles = () => {
  return (
    <>
      <div className="absolute rounded-full animate-bubble1"
           style={{
             right: '20%',
             top: '10%',
             width: '280px',
             height: '280px',
             background: `
               linear-gradient(135deg,
                 rgba(251, 146, 60, 0.85) 0%,
                 rgba(249, 115, 22, 0.6) 50%,
                 rgba(234, 88, 12, 0.4) 100%
               )
             `,
             backdropFilter: 'blur(60px)',
             WebkitBackdropFilter: 'blur(60px)',
             boxShadow: `
               0 8px 32px 0 rgba(234, 88, 12, 0.25),
               inset 0 0 32px 0 rgba(255, 255, 255, 0.4)
             `,
             border: '1px solid rgba(255, 255, 255, 0.25)'
           }}
      />
      <div className="absolute rounded-full animate-bubble2"
           style={{
             left: '15%',
             top: '25%',
             width: '350px',
             height: '350px',
             background: `
               linear-gradient(135deg,
                 rgba(249, 115, 22, 0.85) 0%,
                 rgba(234, 88, 12, 0.6) 50%,
                 rgba(194, 65, 12, 0.4) 100%
               )
             `,
             backdropFilter: 'blur(60px)',
             WebkitBackdropFilter: 'blur(60px)',
             boxShadow: `
               0 8px 32px 0 rgba(234, 88, 12, 0.25),
               inset 0 0 32px 0 rgba(255, 255, 255, 0.4)
             `,
             border: '1px solid rgba(255, 255, 255, 0.25)'
           }}
      />
      <div className="absolute rounded-full animate-bubble3"
           style={{
             right: '30%',
             bottom: '20%',
             width: '230px',
             height: '230px',
             background: `
               linear-gradient(135deg,
                 rgba(251, 146, 60, 0.85) 0%,
                 rgba(249, 115, 22, 0.6) 50%,
                 rgba(234, 88, 12, 0.4) 100%
               )
             `,
             backdropFilter: 'blur(60px)',
             WebkitBackdropFilter: 'blur(60px)',
             boxShadow: `
               0 8px 32px 0 rgba(234, 88, 12, 0.25),
               inset 0 0 32px 0 rgba(255, 255, 255, 0.4)
             `,
             border: '1px solid rgba(255, 255, 255, 0.25)'
           }}
      />
      {/* Extra fényhatások */}
      <div className="fixed inset-0"
           style={{
             background: `
               radial-gradient(circle at 70% 20%, rgba(249, 115, 22, 0.2) 0%, transparent 50%),
               radial-gradient(circle at 30% 70%, rgba(234, 88, 12, 0.25) 0%, transparent 50%)
             `,
             pointerEvents: 'none'
           }}
      />
    </>
  );
};

export default Bubbles;