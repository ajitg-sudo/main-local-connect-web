export default function PageBanner({ eyebrow, title, subtitle, children }) {
  return (
    <section
      className="bg-[linear-gradient(90deg,rgba(8,20,48,0.92),rgba(8,20,48,0.62),rgba(8,20,48,0.34)),linear-gradient(135deg,#1e3a8a,#2563eb)] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8 lg:py-12"
      aria-labelledby="page-banner-title"
    >
      <div className="mx-auto max-w-7xl">
        {eyebrow && <p className="eyebrow text-sky-200">{eyebrow}</p>}
        <h1 id="page-banner-title" className="heading-page mt-2 text-balance">
          {title}
        </h1>
        {subtitle && <p className="text-lead mt-3 max-w-2xl text-pretty text-white/85">{subtitle}</p>}
        {children && <div className="mt-5 sm:mt-6">{children}</div>}
      </div>
    </section>
  );
}
