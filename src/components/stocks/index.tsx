"use client";

import dynamic from "next/dynamic";
import { EventsSkeleton } from "./events-skeleton";
import { StockSkeleton } from "./stock-skeleton";
import { StocksSkeleton } from "./stocks-skeleton";

export { BotCard, BotMessage, SystemMessage } from "./message";
export { spinner } from "./spinner";

const Stock = dynamic(() => import("./stock").then((mod) => mod.Stock), {
  ssr: false,
  loading: () => <StockSkeleton />,
});

const Stocks = dynamic(() => import("./stocks").then((mod) => mod.Stocks), {
  ssr: false,
  loading: () => <StocksSkeleton />,
});

const Events = dynamic(() => import("./events").then((mod) => mod.Events), {
  ssr: false,
  loading: () => <EventsSkeleton />,
});

export { Events, Stock, Stocks };
