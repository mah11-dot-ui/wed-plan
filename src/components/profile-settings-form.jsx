"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, Loader2 } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/toast-provider";

const fieldClass =
  "h-11 w-full rounded-xl border border-cream-300 bg-background px-4 text-sm text-espresso outline-none transition-colors placeholder:text-espresso/40 focus:border-garnet focus:ring-2 focus:ring-garnet/15";

export default function ProfileSettingsForm({ user }) {
  const router = useRouter();
  const { success, error } = useToast();
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [businessName, setBusinessName] = useState(user.businessName ?? "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(user.image ?? null);
  const [saving, setSaving] = useState(false);

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      error("Choose an image under 5 MB.");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadToImgBB = async (file) => {
    const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!key) throw new Error("ImgBB API key isn't configured.");
    const body = new FormData();
    body.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
    const payload = await response.json();
    if (!response.ok || !payload?.data?.url) {
      throw new Error(payload?.error?.message ?? "Image upload failed.");
    }
    return payload.data.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      error("Please enter a name with at least 2 characters.");
      return;
    }

    setSaving(true);
    try {
      const image = imageFile ? await uploadToImgBB(imageFile) : preview;
      const { error: updateError } = await authClient.updateUser({
        name: name.trim(),
        phone: phone.trim(),
        businessName: businessName.trim(),
        image: image || undefined,
      });

      if (updateError) {
        error(updateError.message ?? "Could not update your profile.");
        setSaving(false);
        return;
      }

      success("Profile updated.");
      setSaving(false);
      router.refresh();
    } catch (err) {
      error(err?.message ?? "Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Profile preview" className="size-16 rounded-2xl object-cover" />
        ) : (
          <span className="grid size-16 place-items-center rounded-2xl bg-garnet text-lg font-bold text-garnet-foreground">
            {name.slice(0, 2).toUpperCase() || "W"}
          </span>
        )}
        <div>
          <label
            htmlFor="profile-image"
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-cream-300 bg-background px-4 text-xs font-semibold text-espresso transition-colors hover:border-garnet/40 hover:text-garnet"
          >
            <ImagePlus className="size-4" aria-hidden="true" />
            {imageFile ? "Change photo" : "Upload photo"}
          </label>
          <input id="profile-image" type="file" accept="image/*" onChange={handleImage} className="sr-only" />
          <p className="mt-1.5 text-[10px] text-espresso/50">
            {imageFile ? imageFile.name : "Optional · JPG, PNG or GIF · max 5 MB (ImgBB)"}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="profile-name" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
          Full Name
        </label>
        <input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label htmlFor="profile-phone" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
            Phone
          </label>
          <input id="profile-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+880 1X-XXXX-XXXX" className={fieldClass} />
        </div>
        {user.role === "vendor" && (
          <div className="space-y-1.5">
            <label htmlFor="profile-business" className="text-[11px] font-semibold uppercase tracking-wide text-espresso/60">
              Business Name
            </label>
            <input id="profile-business" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your studio name" className={fieldClass} />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-garnet text-sm font-semibold text-garnet-foreground transition-colors hover:bg-garnet-deep disabled:opacity-70"
      >
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Saving…
          </>
        ) : (
          <>
            <Check className="size-4" aria-hidden="true" />
            Save Changes
          </>
        )}
      </button>
      <p className="text-center text-[11px] leading-5 text-espresso/50">
        Your role and subscription plan can only be changed by WedPlan administrators.
      </p>
    </form>
  );
}
