import React from "react";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Job } from "@/models/Job";
import { Submission } from "@/models/Submission";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import SubmissionForm from "./SubmissionForm"; // Ensure this client component exists
import { Metadata } from "next"; // Added for SEO Types
import {
  BadgeCheck,
  DollarSign,
  Clock,
  Users,
  FileText,
  AlertCircle,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import CopyButton from "./CopyButton";

interface Props {
  params: Promise<{ id: string }>;
}

// DYNAMIC METADATA FOR ADVANCED SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  await connectDB();

  const job = await Job.findById(id);

  if (!job) {
    return {
      title: "Task Not Found | EarnUnity",
    };
  }

  const spotsLeft = (job.totalVacancies || 0) - (job.completedCount || 0);

  return {
    title: `${job.title} - Earn ${job.reward}`,
    description: `Complete this ${job.category || "Micro"} task on EarnUnity. Claim your ${job.reward} instant reward. Only ${spotsLeft} spots left!`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

// MAIN COMPONENT
export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params;

  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  // Fetch Job Data with proper population
  const job = await Job.findById(id).populate({
    path: "userId",
    model: User,
    select: "name",
  });

  if (!job) notFound();

  const existingSubmission = await Submission.findOne({
    jobId: id,
    userId: session.user.id,
  });

  const totalSlots = job.totalVacancies || 0;
  const completionPercentage = Math.min(
    Math.round((job.completedCount / (totalSlots || 1)) * 100),
    100,
  );

  // Fallback fallback link if externalLink doesn't exist in document
  const missionLink = job.externalLink || "";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-700">
      {/* Navigation */}
      <Link
        href="/dashboard/tasks"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-400 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Missions
      </Link>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem]">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">
              {job.category || "Task"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white italic tracking-tight">
            {job.title}
          </h1>
          <p className="text-slate-400 flex items-center gap-2 text-sm">
            <BadgeCheck className="w-4 h-4 text-emerald-500" />
            Client:{" "}
            <span className="font-bold text-slate-200">
              {job.userId?.name || "Verified Client"}
            </span>
          </p>
        </div>

        <div className="bg-indigo-600 rounded-[2rem] p-6 flex items-center gap-5 shadow-xl shadow-indigo-600/20 border border-white/10">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-[10px] text-indigo-200 font-black uppercase tracking-[0.2em]">
              Reward Amount
            </p>
            <p className="text-3xl font-black text-white italic">
              ৳{job.reward}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-slate-900/20 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Mission Instructions
              </h2>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-line text-slate-400 leading-relaxed font-medium">
                {job.instructions || job.description}
              </p>
            </div>

            {/* NEW: External Link Section for Copying/Visiting */}
            {missionLink && (
              <div className="mt-8 p-5 bg-[#0b0f1a]/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 overflow-hidden w-full">
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                    <ExternalLink className="w-3 h-3" /> Mission Assignment Link
                  </p>
                  <p className="text-sm text-slate-300 font-medium truncate bg-[#020617]/50 px-3 py-2 rounded-lg border border-slate-900/60 mt-1.5">
                    {missionLink}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:self-end">
                  <CopyButton text={missionLink} />
                  <a
                    href={missionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 h-9 shrink-0 shadow-md shadow-indigo-600/10"
                  >
                    Open Link
                  </a>
                </div>
              </div>
            )}

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
              <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">
                  Time Limit
                </p>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Clock className="w-4 h-4 text-indigo-400" /> 24 Hours
                </div>
              </div>

              <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">
                  Available Slots
                </p>
                <div className="flex items-center gap-2 text-white font-bold">
                  <Users className="w-4 h-4 text-indigo-400" />
                  {totalSlots - job.completedCount} / {totalSlots} Left
                </div>
              </div>

              <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl">
                <p className="text-[10px] text-slate-500 font-black uppercase mb-2 tracking-widest">
                  Completion
                </p>
                <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Warning Card */}
          <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-[2rem] flex gap-5 items-center">
            <div className="bg-amber-500/20 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="font-bold text-amber-500">Security Warning</h4>
              <p className="text-xs text-amber-500/70 mt-1 font-medium">
                Submitting fake proof or repeating tasks will lead to a{" "}
                <span className="font-bold underline">
                  permanent account ban
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - Submission Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {existingSubmission ? (
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2.5rem] text-center space-y-4">
                <div className="bg-emerald-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <BadgeCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white italic">
                    Proof Submitted!
                  </h3>
                  <p className="text-slate-400 text-sm mt-2">
                    Our team is reviewing your work.
                  </p>
                </div>
                <div className="inline-block px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl">
                  <p className="text-xs text-slate-500 font-black uppercase">
                    Current Status
                  </p>
                  <p
                    className={cn(
                      "text-sm font-black uppercase tracking-widest mt-1",
                      existingSubmission.status === "approved"
                        ? "text-emerald-500"
                        : "text-amber-500",
                    )}
                  >
                    {existingSubmission.status}
                  </p>
                </div>
              </div>
            ) : job.completedCount >= totalSlots ? (
              <div className="bg-rose-500/5 border border-rose-500/20 p-8 rounded-[2.5rem] text-center">
                <h3 className="text-xl font-bold text-white italic">
                  Missions Full
                </h3>
                <p className="text-slate-400 text-sm mt-2">
                  All slots are taken for this task.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-slate-800 p-1 rounded-[2.5rem] overflow-hidden">
                <SubmissionForm jobId={id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Utility function for conditional classes
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
