import type { Metadata } from "next";
import "../globals.css";
import AdminWrapper from "./AdminWrapper";

export const metadata: Metadata = {
    title: "Admin Panel - AL Azeem Fish Feed Industries",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminWrapper>{children}</AdminWrapper>;
}
