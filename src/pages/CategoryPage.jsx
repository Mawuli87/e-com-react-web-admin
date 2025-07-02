import React from "react";
import { useParams } from "react-router-dom";

export default function CategoryPage() {
  const { slug, subslug } = useParams();

  return (
    <div className="container mt-4">
      <h2>
        Category: {slug}
        {subslug && ` > ${subslug}`}
      </h2>
      {/* Later: fetch and show products in this category */}
    </div>
  );
}
