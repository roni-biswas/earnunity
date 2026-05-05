import React from "react";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Job } from "@/models/Job";
import { Submission } from "@/models/Submission";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import SubmissionForm from "./SubmissionForm";
import {
  BadgeCheck,
  DollarSign,
  Clock,
  Users,
  FileText,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JobDetailsPage({ params }: Props) {
  const { id } = await params; // Awaiting params correctly

  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  // Fetch Job Data - Model explicit mapping
  const job = await Job.findById(id).populate({
    path: "userId",
    model: User,
    select: "name",
    options: { strictPopulate: false },
  });

  if (!job) {
    notFound();
  }

  const existingSubmission = await Submission.findOne({
    jobId: id,
    userId: session.user.id,
  });

  const totalSlots = job.totalVacancies || 0;
  const completionPercentage = Math.round(
    (job.completedCount / (totalSlots || 1)) * 100,
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard/tasks"
          className="text-sm text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Tasks
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              {job.title}
            </h1>
            <p className="text-slate-500 mt-2 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-green-500" />
              Posted by:{" "}
              <span className="font-semibold text-slate-700">
                {job.userId?.name || "Verified Client"}
              </span>
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-blue-600 font-bold uppercase">
                Earn Reward
              </p>
              <p className="text-2xl font-black text-blue-900">
                ${job.reward.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-800">
                Job Description & Instructions
              </h2>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="whitespace-pre-line text-slate-600 leading-relaxed">
                {job.instructions || job.description}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                  Time Limit
                </p>
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">24 Hours</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                  Capacity
                </p>
                <div className="flex items-center gap-2 text-slate-700">
                  <Users className="w-4 h-4" />
                  <span className="font-semibold">
                    {job.completedCount} / {totalSlots}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl col-span-2 md:col-span-1">
                <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                  Completion
                </p>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-900">Important Warning</h4>
              <p className="text-sm text-amber-700 mt-1">
                Submitting fake proof or using multiple accounts will result in
                a permanent ban.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {existingSubmission ? (
              <div className="bg-green-50 border border-green-200 p-8 rounded-3xl text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-green-900">
                  Proof Submitted
                </h3>
                <p className="text-green-700 text-sm mt-2">
                  Status: <strong>{existingSubmission.status}</strong>
                </p>
              </div>
            ) : job.completedCount >= totalSlots ? (
              <div className="bg-red-50 border border-red-200 p-8 rounded-3xl text-center">
                <h3 className="text-xl font-bold text-red-900">Task Full</h3>
              </div>
            ) : (
              <SubmissionForm jobId={id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
