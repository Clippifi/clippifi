// Page title block: bold title with tight tracking, muted one-line description.
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col gap-1.5 pt-2">
      <h1 className="text-[28px] leading-[34px] font-bold tracking-[-0.025em]">{title}</h1>
      {description && <p className="text-[15px] leading-[22px] text-muted-foreground">{description}</p>}
    </div>
  );
}
