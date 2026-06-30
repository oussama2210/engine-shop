export function filterProducts(products, { search = "", category = "" } = {}) {
  if (!search && !category) return products;
  return products.filter((p) => {
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      !category ||
      p.category?.toLowerCase().includes(category.toLowerCase());
    return matchSearch && matchCategory;
  });
}

export function highlightMatch(text, query) {
  if (!query || !text) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, "<mark class='bg-yellow-200 rounded px-0.5'>$1</mark>");
}
