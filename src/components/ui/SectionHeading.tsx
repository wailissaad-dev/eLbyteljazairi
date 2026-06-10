import { Reveal } from "@/components/ui/Reveal";

export function SectionHeading({
  title,
  subtitle,
  anchorId,
}: {
  title: string;
  subtitle?: string;
  anchorId?: string;
}) {
  return (
    <>
      {anchorId && <div id={anchorId} className="scroll-mt-[130px]" />}
      <Reveal className="mb-12 text-center md:mb-16">
        <div className="mb-4">
          <span className="ornament font-display text-xl">◈</span>
        </div>
        <h2 className="mb-4 font-display text-section text-ink-primary">{title}</h2>
        {subtitle && <p className="mx-auto max-w-2xl font-body text-ink-secondary">{subtitle}</p>}
      </Reveal>
    </>
  );
}
