"use client";

import { useRouter } from "next/navigation";

export function useNavigate() {
    const router = useRouter();

    function navigate(path: string, options?: { replace?: boolean }) {
        if (options?.replace) {
            router.replace(path); // thay thế URL hiện tại
        } else {
            router.push(path); // điều hướng bình thường
        }
    }

    return navigate;
}
