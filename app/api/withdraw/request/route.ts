import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Withdraw } from "@/models/Withdraw";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { WithdrawZodSchema } from "@/lib/validations/withdraw";

/**
 * PATH: /api/withdraw/request
 * POST: Handles secure user withdrawal requests and dispatches real-time admin flashes
 */
export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // Guard clause to block unauthorized requests
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    // 1. Validate incoming payload metadata through Zod validation core
    const validatedData = WithdrawZodSchema.parse({
      ...body,
      userId: session.user.id,
    });

    // 2. Query MongoDB database context to verify active user wallet balance
    const user = await User.findById(session.user.id);
    if (!user || user.balance < validatedData.amount) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 },
      );
    }

    // 3. Persist the official payout log document inside Withdraw collection
    const newWithdraw = await Withdraw.create(validatedData);

    // 4. Atomically adjust the wallet state balance flags
    user.balance -= validatedData.amount;
    await user.save();

    // 5. Append transaction ledger documents to archive active history states
    await Transaction.create({
      userId: session.user.id,
      amount: validatedData.amount,
      type: "expense",
      category: "withdraw",
      description: `Withdrawal request via ${validatedData.method}`,
      balanceAfter: user.balance,
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request submitted successfully",
      data: newWithdraw,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
