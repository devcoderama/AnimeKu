"use client";

import React from "react";
import { ButtonLayout } from "@/components/Layout/Button";
import AnimeHome from "@/components/api-anime/home";

export default function Home() {
  return (
    <ButtonLayout>
      <main className="flex-grow">
        {/* Remove container and padding for AnimeHome to allow full-width slider */}
        <AnimeHome />
      </main>
    </ButtonLayout>
  );
}
