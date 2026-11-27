"use client";

import { useEffect } from "react";

function isSkipped(el: HTMLElement) {
  if (el.dataset.nsReveal === "off") return true;
  if (el.closest('[data-ns-reveal="off"]')) return true;
  if (el.dataset.nsRevealReady === "1") return true;
  if (el.querySelector(".ns-word")) return true;
  if (!el.textContent?.trim()) return true;
  return false;
}

function wrapNode(node: Node, counter: { index: number }) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? "";
    if (!text.trim()) return;
    const fragment = document.createDocumentFragment();
    for (const part of text.split(/(\s+)/)) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        fragment.appendChild(document.createTextNode(part));
        continue;
      }
      const outer = document.createElement("span");
      outer.className = "ns-word";
      outer.style.setProperty("--ns-wi", String(counter.index++));
      const inner = document.createElement("span");
      inner.className = "ns-word-inner";
      inner.textContent = part;
      outer.appendChild(inner);
      fragment.appendChild(outer);
    }
    node.parentNode?.replaceChild(fragment, node);
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const element = node as HTMLElement;
  if (["SCRIPT", "STYLE", "SVG", "BR", "IMG"].includes(element.tagName)) return;
  if (element.tagName === "svg") return;
  Array.from(element.childNodes).forEach((child) => wrapNode(child, counter));
}

export function GlobalTextReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.classList.add("is-revealed");
          } else {
            el.classList.remove("is-revealed");
          }
        });
      },
      { threshold: 0.12, rootMargin: "-6% 0px -10% 0px" },
    );

    let frame = 0;
    const scan = () => {
      frame = 0;
      const main = document.querySelector("main");
      if (!main) return;
      main.querySelectorAll<HTMLElement>("h1, h2").forEach((el) => {
        if (isSkipped(el)) return;
        el.dataset.nsRevealReady = "1";
        const counter = { index: 0 };
        Array.from(el.childNodes).forEach((child) => wrapNode(child, counter));
        el.classList.add("ns-split");
        observer.observe(el);
      });
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(scan);
    };

    schedule();

    const mutations = new MutationObserver(schedule);
    const main = document.querySelector("main");
    if (main) {
      mutations.observe(main, { childList: true, subtree: true });
    }

    return () => {
      if (frame) cancelAnimationFrame(frame);
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
