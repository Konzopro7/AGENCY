import { useEffect, useState } from "react";

export function useScrollSpy(sectionIds, options = {}) {
  const { rootMargin = "-40% 0px -55% 0px" } = options;
  const [activeId, setActiveId] = useState(sectionIds?.[0] ?? "");

  useEffect(() => {
    if (!sectionIds?.length) return;

    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, rootMargin]);

  return activeId;
}
