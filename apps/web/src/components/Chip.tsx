"use client";

type ChipProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={selected ? "chip chip-selected" : "chip"}
      onClick={onClick}
      aria-pressed={selected}
    >
      {label}
    </button>
  );
}
