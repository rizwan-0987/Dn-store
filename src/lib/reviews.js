import seed from "../../src/components/assets/reviews.json";

const key = (id) => `reviews:${id}`;

export function loadReviews(productId) {
    const local = JSON.parse(localStorage.getItem(key(productId)) || "[]");
    const fromFile = seed.filter(r => r.productId === productId);
    return [...local, ...fromFile].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export function addReview(productId, { name, rating, comment }) {
    const list = JSON.parse(localStorage.getItem(key(productId)) || "[]");
    const review = {
        productId,
        name: name || "User",
        rating: Number(rating),
        comment: String(comment).trim(),
        createdAt: Date.now(),
    };
    const updated = [review, ...list];
    localStorage.setItem(key(productId), JSON.stringify(updated));
    return review;
}
