"use client";

import { useEffect, useState } from "react";

/** Returns the id of the section currently in view (for nav highlighting). */
export function useScrollSpy(ids: string[], offset = 140): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const key = ids.join(",");

  useEffect(() => {
    const list = key.split(",").filter(Boolean);
    const onScroll = () => {
      const y = window.scrollY + offset;
      let current = list[0] ?? "";
      for (const id of list) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [key, offset]);

  return active;
}
