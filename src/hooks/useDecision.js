import { useState } from "react";
import { db } from "../db/database";
import { analizarDecision } from "../brain/decisionEngine";

export function useDecision() {
  const decidir = async ({ situation, options }) => {
    const decision = await analizarDecision({ situation, options });
    await db.decisiones.add({
      ...decision,
      createdAt: Date.now(),
    });
  };
  return { decidir };
}
