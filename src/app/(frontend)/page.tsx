import { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Analytics | waveron - Real Estate Management Admin",
  description: "Analytics dashboard for waveron real estate admin panel.",
};

export default function AnalyticsDashboardPage() {
  return <DashboardClient />;
}
