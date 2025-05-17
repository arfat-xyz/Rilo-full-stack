"use client";
import DashboardClientComponent from "@/components/dashboard/dashboard-client-component";
import { metaDataGeneratorForNormalPage } from "@/hoook/generate-meta";
import React from "react";
export const metadata = metaDataGeneratorForNormalPage("Dashboard");
const DashboardPage = () => {
  return <DashboardClientComponent />;
};

export default DashboardPage;
