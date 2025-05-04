import { useState } from "react";

export function useExpandable(defaultExpanded = false) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const toggle = () => setIsExpanded((prev) => !prev);
  const expand = () => setIsExpanded(true);
  const collapse = () => setIsExpanded(false);
  
  return {
    isExpanded,
    toggle,
    expand,
    collapse,
  };
}
