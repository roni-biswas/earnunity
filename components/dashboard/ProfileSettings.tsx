"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "@/types/settings";
import { toast } from "sonner";
import { User, Camera, Loader2 } from "lucide-react";
import Image from "next/image";

interface ProfileSettingsProps {
  initialName: string;
  initialImage?: string;
}

export default function ProfileSettings({
  initialName,
  initialImage,
}: ProfileSettingsProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string>(initialImage || "");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialName,
      image: initialImage || "",
    },
  });

  /* Handle dynamic image upload to the dedicated avatar endpoint */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    /* Client-side file size optimization guard (Max 2MB) */
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image file size must be less than 2MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/auth/user/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      /* Sync state with Cloudinary secure URL response */
      setPreview(result.imageUrl);
      setValue("image", result.imageUrl);

      toast.success("Profile picture updated successfully!");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  /* Handle name form submission */
  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, image: data.image }),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      toast.success("Profile information saved successfully");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-slate-900/40 border border-slate-800 rounded-[2rem] p-6 shadow-xl text-white"
    >
      <div>
        <h3 className="text-lg font-black uppercase tracking-tight italic">
          Profile Details
        </h3>
        <p className="text-xs text-slate-400">
          Update your public profile display name and avatar.
        </p>
      </div>

      {/* Avatar Upload Grid Section */}
      <div className="flex items-center gap-6">
        <div className="relative w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center group">
          {preview ? (
            <Image src={preview} alt="Avatar" fill className="object-cover" />
          ) : (
            <User className="w-8 h-8 text-slate-500" />
          )}

          <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            {uploading ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-300">Profile Picture</p>
          <p className="text-[10px] text-slate-500">
            {uploading
              ? "Processing layout..."
              : "Square image recommended (Max 2MB)"}
          </p>
        </div>
      </div>

      {/* Profile Name Input Group */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Full Name
        </label>
        <input
          {...register("name")}
          type="text"
          className="w-full bg-slate-950/40 border border-slate-800 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-indigo-500 transition-colors"
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="text-xs text-rose-500 font-bold">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Submission Action Button */}
      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "SAVE PROFILE"
        )}
      </button>
    </form>
  );
}
