"use client";

import CategoryContainer from "~/shared-components/Categories/CategoryContainer";

export default function Dashboard() {
  return (
    <main className="mx-3 flex min-h-screen flex-col items-center">
      <CategoryContainer />
    </main>
  );
}
