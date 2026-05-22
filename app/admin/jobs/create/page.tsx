"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Save,
  LinkIcon,
  DollarSign,
  ListChecks,
  Info,
} from "lucide-react";

import Link from "next/link";
import { JobFormData, JobFormSchema } from "@/lib/validations/jobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateJobPage() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(JobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Other",
      reward: 0,
      totalVacancies: 0,
      instructions: "",
      externalLink: "",
      proofType: "Screenshot",
    },
  });

  const onSubmit = async (data: JobFormData) => {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Job published successfully!");

        router.push("/admin/jobs");

        router.refresh();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Error creating job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/jobs">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full shadow-sm"
            >
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Create New Job
            </h1>
            <p className="text-sm text-muted-foreground">
              Fill in the details to publish a new task.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((data) =>
          onSubmit(data as unknown as JobFormData),
        )}
        className="space-y-6"
      >
        {/* Section 1: Basic Information */}
        <Card className="rounded-2xl border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
          <div className="bg-gray-50/50 px-6 py-4 border-b flex items-center gap-2">
            <Info size={18} className="text-blue-500" />
            <h2 className="font-semibold text-gray-800">Basic Information</h2>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g. Subscribe to my YouTube Channel"
                className="rounded-xl h-11 focus-visible:ring-blue-500"
              />
              {errors.title && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="rounded-xl h-11 bg-white">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="App">App Review</SelectItem>
                        <SelectItem value="Survey">Survey</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="externalLink"
                  className="flex items-center gap-2"
                >
                  <LinkIcon size={14} /> Target URL
                </Label>
                <Input
                  id="externalLink"
                  {...register("externalLink")}
                  placeholder="https://youtube.com/..."
                  className="rounded-xl h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Pricing & Capacity */}
        <Card className="rounded-2xl border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
          <div className="bg-gray-50/50 px-6 py-4 border-b flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-600" />
            <h2 className="font-semibold text-gray-800">Pricing & Capacity</h2>
          </div>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reward">Reward (৳)</Label>
              <Input
                id="reward"
                type="number"
                step="0.01"
                {...register("reward", { valueAsNumber: true })}
                className="rounded-xl h-11"
              />
              {errors.reward && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.reward.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalVacancies">Vacancies</Label>
              <Input
                id="totalVacancies"
                type="number"
                {...register("totalVacancies", { valueAsNumber: true })}
                className="rounded-xl h-11"
                placeholder="100"
              />
              {errors.totalVacancies && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.totalVacancies.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Proof Type</Label>
              <Controller
                name="proofType"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="rounded-xl h-11 bg-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Screenshot">Screenshot</SelectItem>
                      <SelectItem value="Username">Username</SelectItem>
                      <SelectItem value="TransactionID">
                        Transaction ID
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Requirements & Steps */}
        <Card className="rounded-2xl border-none shadow-sm ring-1 ring-gray-100 overflow-hidden">
          <div className="bg-gray-50/50 px-6 py-4 border-b flex items-center gap-2">
            <ListChecks size={18} className="text-indigo-600" />
            <h2 className="font-semibold text-gray-800">
              Instructions & Description
            </h2>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                {...register("description")}
                className="rounded-xl min-h-20"
                placeholder="Give a brief idea about the task..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Step-by-Step Instructions</Label>
              <Textarea
                id="instructions"
                {...register("instructions")}
                className="rounded-xl min-h-37.5"
                placeholder="1. Open link...&#10;2. Subscribe...&#10;3. Take screenshot..."
              />
              {errors.instructions && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.instructions.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full md:w-60 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={20} />
                Publishing...
              </>
            ) : (
              <>
                <Save className="mr-2" size={20} />
                Publish Job
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
