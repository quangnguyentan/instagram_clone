"use client";

import { useState } from "react";
import { useSubmitReport } from "@/hooks/useSocial";
import { Report } from "@/types/social.type";

export default function ReportButton({
  targetType,
  targetId,
  className,
}: {
  targetType: Report["targetType"];
  targetId: string;
  className?: string;
}) {
  const submitReport = useSubmitReport();
  const [submitted, setSubmitted] = useState(false);

  return (
    <span className="inline-flex items-center gap-2 text-xs">
      <button
        type="button"
        disabled={submitted || submitReport.isPending}
        onClick={() =>
          submitReport.mutate(
            { targetType, targetId, reason: "Nội dung không phù hợp" },
            { onSuccess: () => setSubmitted(true) },
          )
        }
        className={
          className ?? "text-gray-500 hover:text-red-600 disabled:opacity-50"
        }
      >
        {submitted ? "Đã báo cáo" : "Báo cáo"}
      </button>
      {submitReport.isError && (
        <span role="alert" className="text-red-600">
          Không gửi được báo cáo.
        </span>
      )}
    </span>
  );
}
