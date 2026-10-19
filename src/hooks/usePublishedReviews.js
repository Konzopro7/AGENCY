import { useEffect, useState } from "react";
import { REVIEWS } from "../config/site.js";
import { TESTIMONIALS_BY_LANG } from "../data/testimonials.js";

function normalizeReview(review) {
  return {
    id: String(review.id || `${review.name}-${review.createdAt || review.comment}`),
    name: String(review.name || ""),
    company: String(review.company || ""),
    service: String(review.service || ""),
    serviceType: String(review.serviceType || ""),
    rating: Math.max(1, Math.min(5, Number(review.rating) || 5)),
    quote: String(review.comment || review.quote || ""),
    role: String(review.serviceType || review.role || ""),
    createdAt: String(review.createdAt || "")
  };
}

export function usePublishedReviews(lang = "fr") {
  const fallback = (TESTIMONIALS_BY_LANG[lang] ?? TESTIMONIALS_BY_LANG.fr).map(normalizeReview);
  const [remoteReviews, setRemoteReviews] = useState([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch(REVIEWS.endpoint, { headers: { Accept: "application/json" }, cache: "no-store" });
        if (!response.ok) return;
        const payload = await response.json();
        if (active && Array.isArray(payload.reviews)) setRemoteReviews(payload.reviews.map(normalizeReview));
      } catch {
      }
    };

    const onAdded = (event) => {
      if (!event.detail) return;
      const review = normalizeReview(event.detail);
      setRemoteReviews((current) => [review, ...current.filter((item) => item.id !== review.id)]);
    };

    load();
    window.addEventListener("kt:review-added", onAdded);
    return () => {
      active = false;
      window.removeEventListener("kt:review-added", onAdded);
    };
  }, []);

  return [...remoteReviews, ...fallback];
}
