"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  WithdrawFormSchema,
  WithdrawFormValues,
} from "@/lib/validations/withdraw";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, WalletCards } from "lucide-react";

interface WithdrawFormProps {
  currentBalance: number;
}

export default function WithdrawForm({ currentBalance }: WithdrawFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WithdrawFormValues>({
    resolver: zodResolver(WithdrawFormSchema),
    defaultValues: {
      amount: 100,
      accountNumber: "",
    },
  });

  const onSubmit = async (data: WithdrawFormValues) => {
    // Basic client-side balance validation
    if (data.amount > currentBalance) {
      toast.error("Insufficient balance in your wallet");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/user/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Withdrawal request submitted successfully");
        reset();
        // Refresh page to sync balance and activities
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to submit request");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-indigo-500/10 rounded-2xl">
          <WalletCards className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white italic uppercase">
            Withdraw Funds
          </h2>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            Safe & Secure Payout
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Payment Method Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Method
          </label>
          <Select
            onValueChange={(value: "bKash" | "Nagad" | "Rocket") =>
              setValue("method", value)
            }
          >
            <SelectTrigger className="bg-slate-800/30 border-slate-700/50 rounded-2xl h-14 text-white focus:ring-indigo-500/50">
              <SelectValue placeholder="Select Payment Method" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white rounded-2xl">
              <SelectItem value="bKash">bKash</SelectItem>
              <SelectItem value="Nagad">Nagad</SelectItem>
              <SelectItem value="Rocket">Rocket</SelectItem>
            </SelectContent>
          </Select>
          {errors.method && (
            <p className="text-[10px] font-bold text-red-400 ml-2">
              {errors.method.message}
            </p>
          )}
        </div>

        {/* Account Number Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Account Number
          </label>
          <Input
            {...register("accountNumber")}
            placeholder="01XXXXXXXXX"
            className="bg-slate-800/30 border-slate-700/50 rounded-2xl h-14 text-white focus:ring-indigo-500/50"
          />
          {errors.accountNumber && (
            <p className="text-[10px] font-bold text-red-400 ml-2">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        {/* Amount Field */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
            Amount (BDT)
          </label>
          <Input
            type="number"
            {...register("amount", { valueAsNumber: true })}
            placeholder="Min 100 BDT"
            className="bg-slate-800/30 border-slate-700/50 rounded-2xl h-14 text-white focus:ring-indigo-500/50"
          />
          {errors.amount && (
            <p className="text-[10px] font-bold text-red-400 ml-2">
              {errors.amount.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              Submit Request <Send className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
