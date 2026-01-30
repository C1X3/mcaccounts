"use client";

import { createContext, useContext, ReactNode } from "react";

interface AdminContextType {
  userRole: "admin" | "support" | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({
  children,
  userRole,
}: {
  children: ReactNode;
  userRole: "admin" | "support" | null;
}) {
  return (
    <AdminContext.Provider value={{ userRole }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminRole() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdminRole must be used within AdminProvider");
  }
  return context;
}
