"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function UserAvatar() {
  const [initials, setInitials] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Try to get profile full_name, fallback to email
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();

        const name = profile?.full_name || user.email || "User";
        setInitials(name.substring(0, 2).toUpperCase());
      }
    }
    getUser();
  }, [supabase]);

  if (!initials)
    return <div className="h-8 w-8 rounded-full bg-zinc-800 animate-pulse" />;

  return (
    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
      <span className="text-xs font-bold text-white tracking-widest">
        {initials}
      </span>
    </div>
  );
}
