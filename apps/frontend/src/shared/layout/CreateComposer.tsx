"use client";

import {
  ChangeEvent,
  DragEvent,
  PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  MapPin,
  SlidersHorizontal,
  Smile,
  X,
} from "lucide-react";
import NextImage from "next/image";
import axios from "axios";
import { useAuthStore } from "@/app/features/auth/store/useAuthStore";
import { useCreatePost } from "@/hooks/usePosts";
import { useCreateReel, useCreateStory } from "@/hooks/useSocial";
import defaultUser from "@/assets/images/avatar_default.jpg";

type CreateKind = "post" | "story" | "reel";
type ComposerStep = "select" | "crop" | "edit" | "details";
type AspectRatio = "original" | "1:1" | "4:5" | "16:9";
type EditTab = "filters" | "adjust";
type FilterOption = {
  name: string;
  css: string;
};

const aspectRatios: AspectRatio[] = ["original", "1:1", "4:5", "16:9"];

const filters: FilterOption[] = [
  { name: "Gốc", css: "none" },
  { name: "Aden", css: "sepia(.18) saturate(1.35) contrast(.9)" },
  { name: "Clarendon", css: "contrast(1.18) saturate(1.25)" },
  { name: "Crema", css: "sepia(.12) contrast(.95) brightness(1.05)" },
  { name: "Gingham", css: "brightness(1.08) hue-rotate(-8deg) saturate(.85)" },
  { name: "Juno", css: "saturate(1.35) contrast(1.08)" },
  { name: "Lark", css: "brightness(1.08) saturate(.9)" },
  { name: "Ludwig", css: "saturate(.9) contrast(1.08)" },
  { name: "Moon", css: "grayscale(1) contrast(1.08) brightness(1.08)" },
  { name: "Perpetua", css: "saturate(1.15) contrast(.95)" },
  { name: "Reyes", css: "sepia(.22) brightness(1.08) saturate(.85)" },
  { name: "Slumber", css: "saturate(.7) brightness(1.05)" },
];

const ratioValue = (ratio: AspectRatio, originalAspect: number) => {
  if (ratio === "original") return originalAspect;
  const [width, height] = ratio.split(":").map(Number);
  return width / height;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function getCropFractions(
  width: number,
  height: number,
  aspect: number,
  zoom: number,
) {
  const sourceAspect = width / height;
  const widthFraction = sourceAspect > aspect ? aspect / sourceAspect : 1;
  const heightFraction = sourceAspect > aspect ? 1 : sourceAspect / aspect;
  return {
    width: widthFraction / zoom,
    height: heightFraction / zoom,
  };
}

function makeFilter(
  baseFilter: string,
  brightness: number,
  contrast: number,
  saturation: number,
) {
  const adjustments = [
    `brightness(${brightness}%)`,
    `contrast(${contrast}%)`,
    `saturate(${saturation}%)`,
  ];
  return [baseFilter === "none" ? "" : baseFilter, ...adjustments]
    .filter(Boolean)
    .join(" ");
}

async function createEditedImage(
  file: File,
  ratio: AspectRatio,
  zoom: number,
  focus: { x: number; y: number },
  filter: string,
) {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Không đọc được ảnh ${file.name}`));
    });

    const aspect = ratioValue(
      ratio,
      image.naturalWidth / image.naturalHeight,
    );
    const fractions = getCropFractions(
      image.naturalWidth,
      image.naturalHeight,
      aspect,
      zoom,
    );
    const cropWidth = image.naturalWidth * fractions.width;
    const cropHeight = image.naturalHeight * fractions.height;
    const centerX = clamp(
      focus.x * image.naturalWidth,
      cropWidth / 2,
      image.naturalWidth - cropWidth / 2,
    );
    const centerY = clamp(
      focus.y * image.naturalHeight,
      cropHeight / 2,
      image.naturalHeight - cropHeight / 2,
    );
    const outputWidth =
      aspect >= 1 ? 1080 : Math.round(1080 * aspect);
    const outputHeight =
      aspect >= 1 ? Math.round(1080 / aspect) : 1080;
    const canvas = document.createElement("canvas");
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Trình duyệt không hỗ trợ chỉnh sửa ảnh.");

    context.filter = filter;
    context.drawImage(
      image,
      centerX - cropWidth / 2,
      centerY - cropHeight / 2,
      cropWidth,
      cropHeight,
      0,
      0,
      outputWidth,
      outputHeight,
    );

    const outputType =
      file.type === "image/png"
        ? "image/png"
        : file.type === "image/webp"
          ? "image/webp"
          : "image/jpeg";
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) =>
          result
            ? resolve(result)
            : reject(new Error(`Không thể xuất ảnh ${file.name}`)),
        outputType,
        0.92,
      );
    });
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const extension = outputType === "image/png" ? "png" : outputType === "image/webp" ? "webp" : "jpg";
    return new File([blob], `${baseName}.${extension}`, { type: outputType });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function errorMessage(error: unknown) {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(", ");
    if (message) return message;
  }
  return error instanceof Error ? error.message : "Không thể chia sẻ nội dung.";
}

interface CreateComposerProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateComposer({
  open,
  onClose,
}: Readonly<CreateComposerProps>) {
  const user = useAuthStore((state) => state.user);
  const createPost = useCreatePost();
  const createStory = useCreateStory();
  const createReel = useCreateReel();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const [kind, setKind] = useState<CreateKind>("post");
  const [step, setStep] = useState<ComposerStep>("select");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [locationOpen, setLocationOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [focus, setFocus] = useState({ x: 0.5, y: 0.5 });
  const [editTab, setEditTab] = useState<EditTab>("filters");
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPending =
    isSubmitting ||
    createPost.isPending ||
    createStory.isPending ||
    createReel.isPending;
  const currentFile = files[activeIndex];
  const currentPreview = previews[activeIndex];
  const activeIsVideo = currentFile?.type.startsWith("video/") ?? false;
  const imageIndexes = files.flatMap((file, index) =>
    file.type.startsWith("image/") ? [index] : [],
  );
  const filterStyle = makeFilter(
    selectedFilter.css,
    brightness,
    contrast,
    saturation,
  );
  const cropAspect = ratioValue(
    aspectRatio,
    imageSize ? imageSize.width / imageSize.height : 1,
  );
  const moveImage = (direction: -1 | 1) => {
    const currentPosition = imageIndexes.indexOf(activeIndex);
    const nextPosition =
      (currentPosition + direction + imageIndexes.length) % imageIndexes.length;
    setActiveIndex(imageIndexes[nextPosition]);
  };

  useEffect(() => {
    if (!open) return;
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files, open]);

  useEffect(() => {
    if (!open) return;
    setKind("post");
    setStep("select");
    setFiles([]);
    setCaption("");
    setLocation("");
    setLocationOpen(false);
    setActiveIndex(0);
    setZoom(1);
    setFocus({ x: 0.5, y: 0.5 });
    setAspectRatio("1:1");
    setSelectedFilter(filters[0]);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setError("");
  }, [open]);

  useEffect(() => {
    setImageSize(null);
  }, [activeIndex, currentPreview]);

  if (!open) return null;

  const resetDraft = () => {
    setFiles([]);
    setCaption("");
    setLocation("");
    setLocationOpen(false);
    setStep("select");
    setActiveIndex(0);
    setError("");
  };

  const closeComposer = () => {
    if (isPending) return;
    if (
      (files.length > 0 || caption.trim() || location.trim()) &&
      !window.confirm("Bỏ nội dung bạn đang tạo?")
    ) {
      return;
    }
    resetDraft();
    onClose();
  };

  const handleKindChange = (nextKind: CreateKind) => {
    if (
      (files.length || caption.trim() || location.trim()) &&
      !window.confirm("Đổi loại nội dung và bỏ nội dung đang tạo?")
    ) {
      return;
    }
    setKind(nextKind);
    setFiles([]);
    setCaption("");
    setLocation("");
    setActiveIndex(0);
    setStep("select");
    setError("");
  };

  const acceptFiles = (selectedFiles: File[]) => {
    setError("");
    const limit = kind === "post" ? 10 : 1;
    const selected = selectedFiles.slice(0, limit);
    if (!selected.length) return;
    if (
      selected.some(
        (file) =>
          !file.type.startsWith("image/") && !file.type.startsWith("video/"),
      )
    ) {
      setError("Chỉ hỗ trợ ảnh hoặc video.");
      return;
    }
    if (kind === "reel" && selected.some((file) => !file.type.startsWith("video/"))) {
      setError("Reel cần là tệp video.");
      return;
    }
    if (selected.some((file) => file.size > 100 * 1024 * 1024)) {
      setError("Mỗi tệp cần nhỏ hơn 100 MB.");
      return;
    }
    setFiles(selected);
    const firstImageIndex = selected.findIndex((file) =>
      file.type.startsWith("image/"),
    );
    setActiveIndex(firstImageIndex >= 0 ? firstImageIndex : 0);
    setZoom(1);
    setFocus({ x: 0.5, y: 0.5 });
    setAspectRatio("1:1");
    setSelectedFilter(filters[0]);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setStep(
      kind === "post" && firstImageIndex >= 0 ? "crop" : "details",
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    acceptFiles(Array.from(event.currentTarget.files ?? []));
    event.currentTarget.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    acceptFiles(Array.from(event.dataTransfer.files));
  };

  const previousStep = () => {
    setError("");
    if (step === "select") {
      closeComposer();
    } else if (step === "crop") {
      setStep("select");
    } else if (step === "edit") {
      setStep("crop");
    } else if (kind === "post" && files.some((file) => file.type.startsWith("image/"))) {
      setStep("edit");
    } else {
      setStep("select");
    }
  };

  const moveFocus = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !imageSize) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const deltaX = event.clientX - dragRef.current.x;
    const deltaY = event.clientY - dragRef.current.y;
    const crop = getCropFractions(
      imageSize.width,
      imageSize.height,
      cropAspect,
      zoom,
    );
    setFocus((current) => ({
      x: clamp(
        current.x - (deltaX / bounds.width) * crop.width,
        crop.width / 2,
        1 - crop.width / 2,
      ),
      y: clamp(
        current.y - (deltaY / bounds.height) * crop.height,
        crop.height / 2,
        1 - crop.height / 2,
      ),
    }));
    dragRef.current = { x: event.clientX, y: event.clientY };
  };

  const submit = async () => {
    if (!files.length) {
      setError("Hãy chọn ảnh hoặc video trước.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const uploadFiles =
        kind === "post"
          ? await Promise.all(
              files.map((file) =>
                file.type.startsWith("image/")
                  ? createEditedImage(
                      file,
                      aspectRatio,
                      zoom,
                      focus,
                      filterStyle,
                    )
                  : file,
              ),
            )
          : files;
      const formData = new FormData();
      formData.append("caption", caption.trim());

      if (kind === "story") {
        formData.append("file", uploadFiles[0]);
        await createStory.mutateAsync(formData);
      } else if (kind === "reel") {
        if (!uploadFiles[0].type.startsWith("video/")) {
          throw new Error("Reel cần là tệp video.");
        }
        formData.append("files", uploadFiles[0]);
        await createReel.mutateAsync(formData);
      } else {
        if (location.trim()) formData.append("location", location.trim());
        uploadFiles.forEach((file) => formData.append("files", file));
        await createPost.mutateAsync(formData);
      }

      resetDraft();
      onClose();
    } catch (submitError) {
      setError(errorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const title =
    step === "crop"
      ? "Cắt"
      : step === "edit"
        ? "Chỉnh sửa"
        : step === "details"
          ? kind === "post"
            ? "Tạo bài viết mới"
            : kind === "story"
              ? "Tạo tin mới"
              : "Tạo reel mới"
          : "Tạo bài viết mới";
  const showShare = step === "details";
  const canGoNext =
    step === "select"
      ? files.length > 0
      : step === "crop" || step === "edit";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3 sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeComposer();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex h-[min(800px,92vh)] w-full max-w-[1000px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
      >
        <header className="relative flex h-14 shrink-0 items-center justify-between border-b px-4">
          <button
            type="button"
            onClick={previousStep}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"
            aria-label={step === "select" ? "Đóng" : "Quay lại"}
          >
            {step === "select" ? <X size={21} /> : <ArrowLeft size={21} />}
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold">
            {title}
          </h1>
          {showShare ? (
            <button
              type="button"
              disabled={isPending}
              onClick={() => void submit()}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {isPending ? "Đang chia sẻ..." : "Chia sẻ"}
            </button>
          ) : canGoNext ? (
            <button
              type="button"
              onClick={() => {
                setError("");
                if (step === "select") {
                  setStep(
                    kind === "post" &&
                      files.some((file) => file.type.startsWith("image/"))
                      ? "crop"
                      : "details",
                  );
                } else if (step === "crop") {
                  setStep("edit");
                } else if (step === "edit") {
                  setStep("details");
                }
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Tiếp
            </button>
          ) : (
            <span className="w-9" />
          )}
        </header>

        {step === "select" && (
          <div
            className="flex min-h-0 flex-1 flex-col items-center justify-center p-6 text-center"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="mb-5 flex rounded-full bg-gray-100 p-1">
              {(["post", "story", "reel"] as const).map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => handleKindChange(value)}
                  className={`rounded-full px-4 py-2 text-sm ${kind === value ? "bg-white font-semibold shadow-sm" : "text-gray-500"}`}
                >
                  {value === "post" ? "Bài viết" : value === "story" ? "Tin" : "Reel"}
                </button>
              ))}
            </div>
            {files.length ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <ImagePlus size={38} strokeWidth={1.5} />
                  <span>{files.length} tệp đã chọn</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {files.map((file, index) => (
                    <button
                      type="button"
                      key={`${file.name}-${index}`}
                      onClick={() => setActiveIndex(index)}
                      className={`max-w-56 truncate rounded border px-3 py-2 text-xs ${index === activeIndex ? "border-blue-600 text-blue-700" : "border-gray-200"}`}
                    >
                      {file.name}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="rounded-lg border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
                  >
                    Đổi tệp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const imageIndex = files.findIndex((file) =>
                        file.type.startsWith("image/"),
                      );
                      setActiveIndex(imageIndex >= 0 ? imageIndex : 0);
                      setStep(
                        kind === "post" && imageIndex >= 0
                          ? "crop"
                          : "details",
                      );
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            ) : (
              <>
                <ImagePlus size={56} strokeWidth={1.2} className="mb-4 text-gray-800" />
                <h2 className="mb-5 text-xl font-light">
                  Kéo ảnh và video vào đây
                </h2>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Chọn từ máy tính
                </button>
                <p className="mt-4 text-xs text-gray-500">
                  {kind === "post"
                    ? "Có thể chọn tối đa 10 ảnh hoặc video."
                    : kind === "story"
                      ? "Chọn một ảnh hoặc video cho tin của bạn."
                      : "Chọn một video để tạo reel."}
                </p>
              </>
            )}
            {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
            <input
              ref={inputRef}
              type="file"
              accept={kind === "reel" ? "video/*" : "image/*,video/*"}
              multiple={kind === "post"}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}

        {step === "crop" && currentFile && currentPreview && (
          <div className="flex min-h-0 flex-1 flex-col bg-[#fafafa] md:flex-row">
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black p-4">
              <div
                className="relative max-h-full max-w-full touch-none cursor-grab overflow-hidden active:cursor-grabbing"
                style={{
                  aspectRatio: String(cropAspect),
                  width: `min(100%, ${70 * Math.min(cropAspect, 1)}vh)`,
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  dragRef.current = { x: event.clientX, y: event.clientY };
                }}
                onPointerMove={moveFocus}
                onPointerUp={() => {
                  dragRef.current = null;
                }}
                onPointerCancel={() => {
                  dragRef.current = null;
                }}
              >
                <img
                  src={currentPreview}
                  alt="Ảnh đang cắt"
                  onLoad={(event) =>
                    setImageSize({
                      width: event.currentTarget.naturalWidth,
                      height: event.currentTarget.naturalHeight,
                    })
                  }
                  className="h-full w-full select-none object-cover"
                  style={{
                    objectPosition: `${focus.x * 100}% ${focus.y * 100}%`,
                    transform: `scale(${zoom})`,
                    transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
                  }}
                  draggable={false}
                />
                {imageIndexes.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Ảnh trước"
                      onClick={() => moveImage(-1)}
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label="Ảnh tiếp theo"
                      onClick={() => moveImage(1)}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <aside className="flex w-full shrink-0 flex-col gap-5 border-t bg-white p-5 md:w-72 md:border-l md:border-t-0">
              <div>
                <h2 className="mb-3 text-sm font-semibold">Tỷ lệ khung hình</h2>
                <div className="flex flex-wrap gap-2">
                  {aspectRatios.map((ratio) => (
                    <button
                      type="button"
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`rounded-full border px-3 py-1.5 text-xs ${ratio === aspectRatio ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200"}`}
                    >
                      {ratio === "original" ? "Gốc" : ratio}
                    </button>
                  ))}
                </div>
              </div>
              <label className="grid gap-2 text-sm">
                <span className="font-semibold">Thu phóng</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoom}
                  onChange={(event) => setZoom(Number(event.target.value))}
                  className="accent-blue-600"
                />
              </label>
              <p className="text-xs leading-5 text-gray-500">
                Kéo ảnh để căn chỉnh vị trí trong khung.
              </p>
            </aside>
          </div>
        )}

        {step === "edit" && currentFile && currentPreview && (
          <div className="flex min-h-0 flex-1 flex-col md:flex-row">
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black p-4">
              <div
                className="relative max-h-full max-w-full overflow-hidden"
                style={{
                  aspectRatio: String(cropAspect),
                  width: `min(100%, ${70 * Math.min(cropAspect, 1)}vh)`,
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              >
                <img
                  src={currentPreview}
                  alt="Xem trước chỉnh sửa"
                  className="h-full w-full object-cover"
                  style={{
                    filter: filterStyle,
                    objectPosition: `${focus.x * 100}% ${focus.y * 100}%`,
                    transform: `scale(${zoom})`,
                    transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
                  }}
                />
                {imageIndexes.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Ảnh trước"
                      onClick={() => moveImage(-1)}
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label="Ảnh tiếp theo"
                      onClick={() => moveImage(1)}
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <aside className="flex w-full shrink-0 flex-col border-t bg-white md:w-[330px] md:border-l md:border-t-0">
              <div className="grid grid-cols-2 border-b text-sm font-semibold">
                <button
                  type="button"
                  onClick={() => setEditTab("filters")}
                  className={`flex items-center justify-center gap-2 py-4 ${editTab === "filters" ? "border-b-2 border-black" : "text-gray-500"}`}
                >
                  Bộ lọc
                </button>
                <button
                  type="button"
                  onClick={() => setEditTab("adjust")}
                  className={`flex items-center justify-center gap-2 py-4 ${editTab === "adjust" ? "border-b-2 border-black" : "text-gray-500"}`}
                >
                  <SlidersHorizontal size={15} />
                  Điều chỉnh
                </button>
              </div>
              {editTab === "filters" ? (
                <div className="grid grid-cols-3 gap-x-3 gap-y-4 overflow-y-auto p-4">
                  {filters.map((filter) => (
                    <button
                      type="button"
                      key={filter.name}
                      onClick={() => setSelectedFilter(filter)}
                      className="text-center"
                    >
                      <img
                        src={currentPreview}
                        alt=""
                        className={`aspect-square w-full object-cover ${selectedFilter.name === filter.name ? "outline outline-2 outline-blue-600" : ""}`}
                        style={{ filter: filter.css }}
                      />
                      <span className={`mt-1 block text-xs ${selectedFilter.name === filter.name ? "font-semibold" : ""}`}>
                        {filter.name}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid content-start gap-6 overflow-y-auto p-5">
                  {[
                    ["Độ sáng", brightness, setBrightness],
                    ["Tương phản", contrast, setContrast],
                    ["Độ bão hòa", saturation, setSaturation],
                  ].map(([label, value, setter]) => (
                    <label className="grid gap-2 text-sm" key={label as string}>
                      <span className="flex justify-between">
                        <span>{label as string}</span>
                        <span className="text-gray-500">{value as number}</span>
                      </span>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={value as number}
                        onChange={(event) =>
                          (setter as (value: number) => void)(Number(event.target.value))
                        }
                        className="accent-blue-600"
                      />
                    </label>
                  ))}
                </div>
              )}
            </aside>
          </div>
        )}

        {step === "details" && (
          <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] md:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.9fr)] md:grid-rows-1">
            <div className="relative flex min-h-0 items-center justify-center overflow-hidden bg-black">
              {currentPreview && activeIsVideo ? (
                <video
                  src={currentPreview}
                  controls
                  className="h-full max-h-full w-full object-contain"
                />
              ) : currentPreview ? (
                kind === "post" ? (
                  <div
                    className="relative max-h-full max-w-full overflow-hidden"
                    style={{
                      aspectRatio: String(cropAspect),
                      width: `min(100%, ${70 * Math.min(cropAspect, 1)}vh)`,
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  >
                    <img
                      src={currentPreview}
                      alt="Xem trước bài viết"
                      className="h-full w-full object-cover"
                      style={{
                        filter: filterStyle,
                        objectPosition: `${focus.x * 100}% ${focus.y * 100}%`,
                        transform: `scale(${zoom})`,
                        transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
                      }}
                    />
                  </div>
                ) : (
                  <img
                    src={currentPreview}
                    alt="Xem trước nội dung"
                    className="h-full max-h-full w-full object-contain"
                  />
                )
              ) : null}
              {files.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Ảnh trước"
                    onClick={() =>
                      setActiveIndex((index) => (index - 1 + files.length) % files.length)
                    }
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    aria-label="Ảnh tiếp theo"
                    onClick={() =>
                      setActiveIndex((index) => (index + 1) % files.length)
                    }
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                    {activeIndex + 1}/{files.length}
                  </span>
                </>
              )}
            </div>
            <aside className="flex min-h-0 flex-col overflow-y-auto bg-white">
              <div className="flex items-center gap-3 border-b p-4">
                <NextImage
                  src={user?.avatarUrl || defaultUser}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm font-semibold">{user?.username}</span>
              </div>
              <div className="relative border-b p-4">
                <textarea
                  value={caption}
                  onChange={(event) => setCaption(event.target.value.slice(0, 2200))}
                  maxLength={2200}
                  rows={7}
                  placeholder="Thêm chú thích..."
                  className="w-full resize-none text-sm outline-none"
                  aria-label="Chú thích"
                />
                <div className="flex items-center justify-between text-gray-400">
                  <Smile size={19} />
                  <span className="text-xs">{caption.length}/2.200</span>
                </div>
              </div>
              {kind === "post" && (
                <div className="border-b">
                  <button
                    type="button"
                    onClick={() => setLocationOpen((value) => !value)}
                    className="flex w-full items-center gap-3 p-4 text-left text-sm"
                  >
                    <MapPin size={19} />
                    <span className="flex-1">{location || "Thêm vị trí"}</span>
                    <ChevronDown
                      size={17}
                      className={`transition-transform ${locationOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {locationOpen && (
                    <input
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      maxLength={120}
                      placeholder="Tìm kiếm vị trí"
                      aria-label="Vị trí"
                      className="mx-4 mb-4 w-[calc(100%-2rem)] rounded-lg bg-gray-100 px-3 py-2 text-sm outline-none"
                    />
                  )}
                </div>
              )}
              {error && (
                <p role="alert" className="px-4 pt-3 text-sm text-red-600">
                  {error}
                </p>
              )}
              <div className="mt-auto p-4 text-xs leading-5 text-gray-400">
                {kind === "post"
                  ? "Bài viết sẽ được chia sẻ với những người có thể xem trang cá nhân của bạn."
                  : kind === "story"
                    ? "Tin sẽ hiển thị trong 24 giờ."
                    : "Reel sẽ được chia sẻ với mọi người."}
              </div>
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}
