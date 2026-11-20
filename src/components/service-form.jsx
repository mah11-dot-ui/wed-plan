"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";

import { useToast } from "@/components/toast-provider";

const categories = [
  { slug: "photography", name: "Photography & Videography" },
  { slug: "venues", name: "Wedding Venues" },
  { slug: "decoration", name: "Decoration & Florist" },
  { slug: "catering", name: "Catering Services" },
  { slug: "makeup", name: "Makeup & Styling" },
  { slug: "fashion", name: "Wedding Fashion" },
];

const fieldClass =
  "h-11 w-full rounded-xl border border-cream-300 bg-background px-4 text-sm text-espresso outline-none transition-colors placeholder:text-espresso/40 focus:border-garnet focus:ring-2 focus:ring-garnet/15";

export default function ServiceForm({ initial = null, serviceId = null }) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [serviceName, setServiceName] = useState(initial?.serviceName ?? "");
  const [categorySlug, setCategorySlug] = useState(initial?.categorySlug ?? "photography");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initial?.serviceImage ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const isEdit = Boolean(serviceId);

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }
    setError("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadToImgBB = async (file) => {
    const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!key) throw new Error("ImgBB API key isn't configured (NEXT_PUBLIC_IMGBB_API_KEY).");
    const body = new FormData();
    body.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: "POST",
      body,
    });
    const payload = await response.json();
    if (!response.ok || !payload?.data?.url) {
      throw new Error(payload?.error?.message ?? "Image upload failed. Please try again.");
    }
    return payload.data.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    const selected = categories.find((c) => c.slug === categorySlug) ?? categories[0];
    const localErrors = {};
    if (serviceName.trim().length < 3) localErrors.serviceName = "At least 3 characters.";
    if (description.trim().length < 10) localErrors.description = "At least 10 characters.";
    if (!price || Number(price) <= 0) localErrors.price = "Enter a price above zero.";
    if (location.trim().length < 2) localErrors.location = "Enter a location.";
    if (!imagePreview) localErrors.serviceImage = "Upload a service image.";
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      setError("Please fix the highlighted fields.");
      toastError("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const serviceImage = imageFile ? await uploadToImgBB(imageFile) : imagePreview;
      const payload = {
        serviceName: serviceName.trim(),
        category: selected.name,
        categorySlug: selected.slug,
        description: description.trim(),
        price: Number(price),
        location: location.trim(),
        serviceImage,
      };

      const response = await fetch(
        isEdit ? `/api/vendor/services/${serviceId}` : "/api/vendor/services",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data?.message ?? "Could not save the service.");
        setFieldErrors(data?.errors ?? {});
        toastError(data?.message ?? "Could not save the service.");
        setSubmitting(false);
        return;
      }

      success(isEdit ? "Service updated — pending re-approval." : "Service submitted for approval!");
      router.push("/vendor/services");
      router.refresh();
    } catch (err) {
      setError(err?.message ?? "Something went wrong. Please try again.");
      toastError(err?.message ?? "Something went wrong.");
      setSubmitting(false);
    }
  };

  const field = (key) =>
    "flex flex-col gap-1.5 " + (fieldErrors[key] ? "text-destructive" : "");

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className={field("serviceName")}>
        <label htmlFor="svc-name" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
          Service Name
        </label>
        <input
          id="svc-name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="e.g. Royal Wedding Photography"
          className={fieldClass}
        />
        {fieldErrors.serviceName && <p className="text-[11px]">{fieldErrors.serviceName}</p>}
      </div>

      <div className={field("category")}>
        <label htmlFor="svc-category" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
          Service Category
        </label>
        <select
          id="svc-category"
          value={categorySlug}
          onChange={(e) => setCategorySlug(e.target.value)}
          className={fieldClass}
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className={field("description")}>
        <label htmlFor="svc-description" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
          Description
        </label>
        <textarea
          id="svc-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Tell couples what makes your service special…"
          className="w-full resize-none rounded-xl border border-cream-300 bg-background px-4 py-3 text-sm text-espresso outline-none transition-colors placeholder:text-espresso/40 focus:border-garnet focus:ring-2 focus:ring-garnet/15"
        />
        {fieldErrors.description && <p className="text-[11px]">{fieldErrors.description}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className={field("price")}>
          <label htmlFor="svc-price" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
            Price (BDT)
          </label>
          <input
            id="svc-price"
            type="number"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="45000"
            className={fieldClass}
          />
          {fieldErrors.price && <p className="text-[11px]">{fieldErrors.price}</p>}
        </div>
        <div className={field("location")}>
          <label htmlFor="svc-location" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
            Location
          </label>
          <input
            id="svc-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Gulshan, Dhaka"
            className={fieldClass}
          />
          {fieldErrors.location && <p className="text-[11px]">{fieldErrors.location}</p>}
        </div>
      </div>

      <div className={field("serviceImage")}>
        <label htmlFor="svc-image" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
          Service Image
        </label>
        <div className="flex items-center gap-4">
          <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-dashed border-cream-300 bg-cream-200">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Service preview" className="size-full object-cover" />
            ) : (
              <ImagePlus className="size-6 text-espresso/40" aria-hidden="true" />
            )}
          </div>
          <div>
            <label
              htmlFor="svc-image"
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-cream-300 bg-background px-4 text-xs font-semibold text-espresso transition-colors hover:border-garnet/40 hover:text-garnet"
            >
              <ImagePlus className="size-4" aria-hidden="true" />
              {imageFile ? "Change image" : "Upload image"}
            </label>
            <input
              id="svc-image"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="sr-only"
            />
            <p className="mt-1.5 text-[10px] text-espresso/50">
              {imageFile ? imageFile.name : "JPG, PNG or GIF — max 5 MB (stored on ImgBB)"}
            </p>
          </div>
        </div>
        {fieldErrors.serviceImage && <p className="text-[11px]">{fieldErrors.serviceImage}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-garnet text-sm font-semibold text-garnet-foreground transition-colors hover:bg-garnet-deep disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            {isEdit ? "Saving changes…" : "Submitting service…"}
          </>
        ) : isEdit ? (
          "Save Changes"
        ) : (
          "Submit Service"
        )}
      </button>
      {!isEdit && (
        <p className="text-center text-[11px] leading-5 text-espresso/50">
          New services start as <strong className="text-espresso/70">Pending</strong> and go live
          after an admin approves them.
        </p>
      )}
    </form>
  );
}
