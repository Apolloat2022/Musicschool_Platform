import { school } from "@/config/school";

// Renders the school name with a single word highlighted in the accent color,
// e.g. "Apollo <Music> Academy". Falls back to the plain name if the configured
// accent word is empty or not part of the name.
export function BrandName({
  className,
  accentClassName = "text-indigo-500",
  short = false,
}: {
  className?: string;
  accentClassName?: string;
  /** Use the compact `shortName` (nav bars) instead of the full name. */
  short?: boolean;
}) {
  const { name, shortName, accentWord } = school;

  let before: string;
  let accent: string | undefined;
  let after = "";

  if (short) {
    // Highlight the last word of the short name, e.g. "Apollo <Academy>".
    const idx = shortName.lastIndexOf(" ");
    if (idx === -1) return <span className={className}>{shortName}</span>;
    before = shortName.slice(0, idx + 1);
    accent = shortName.slice(idx + 1);
  } else {
    if (!accentWord || !name.includes(accentWord)) {
      return <span className={className}>{name}</span>;
    }
    [before, after] = name.split(accentWord);
    accent = accentWord;
  }

  return (
    <span className={className}>
      {before}
      <span className={accentClassName}>{accent}</span>
      {after}
    </span>
  );
}
