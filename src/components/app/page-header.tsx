// Page title block: bold title with tight tracking, muted one-line description.
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1.5 pt-2">
      <h1 className="text-[24px] leading-[30px] sm:text-[28px] sm:leading-[34px] font-bold tracking-[-0.025em]">{title}</h1>
      {description && <p className="text-body leading-[22px] text-muted-foreground">{description}</p>}
    </div>
  );
}
