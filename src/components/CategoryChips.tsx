"use client";

type CategoryChipsProps = {
  categories: string[];
  selected: string[];
  onChange: (categories: string[]) => void;
};

export function CategoryChips({
  categories,
  selected,
  onChange,
}: CategoryChipsProps) {
  const allSelected = selected.length === 0;

  return (
    <div
      className="mt-3 flex gap-2 overflow-x-auto pb-1"
      role="group"
      aria-label="Categories"
    >
      <button
        type="button"
        onClick={() => onChange([])}
        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
          allSelected
            ? "bg-neutral-900 text-white"
            : "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200"
        }`}
      >
        All
      </button>
      {categories.map((category) => {
        const active = selected.includes(category);
        return (
          <button
            key={category}
            type="button"
            onClick={() => {
              if (active) {
                onChange(selected.filter((c) => c !== category));
              } else {
                onChange([...selected, category]);
              }
            }}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
