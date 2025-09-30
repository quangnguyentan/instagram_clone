"use client";
import { useEffect } from "react";
import { useNavigate } from "@/hooks/useNavigate";
import { useQueryClient } from "@tanstack/react-query";
import { setLogoutContext } from "@/lib/logoutHandler";

export default function ClientInitializer() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    setLogoutContext(queryClient, navigate);
  }, [navigate, queryClient]);

  return null;
}
