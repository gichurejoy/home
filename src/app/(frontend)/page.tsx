import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Analytics | Lahomes - Real Estate Management Admin",
  description: "Analytics dashboard for Lahomes real estate admin panel.",
};

export default function AnalyticsDashboardPage() {
  return <DashboardClient />;
}
