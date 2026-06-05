"use client";

import { ProductFilters } from "./ProductFilters";

type MobileFilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  filterProps: React.ComponentProps<typeof ProductFilters>;
};

export function MobileFilterDrawer({
  open,
  onClose,
  filterProps,
}: MobileFilterDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal>
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            Done
          </button>
        </div>
        <ProductFilters {...filterProps} />
      </div>
    </div>
  );
}
