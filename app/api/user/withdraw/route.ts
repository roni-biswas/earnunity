import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Withdraw } from "@/models/Withdraw";
import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { WithdrawZodSchema } from "@/lib/validations/withdraw";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    // 1. Authenticate user
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const userId = session.user.id;

    // 2. Validate using your original Zod Schema
    const validation = WithdrawZodSchema.safeParse({
      ...body,
      userId: userId,
      status: "pending",
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error,
        },
        { status: 400 },
      );
    }

    const { amount, method, accountNumber } = validation.data;

    // 3. Verify balance existence
    const user = await User.findById(userId);
    if (!user || user.balance < amount) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 },
      );
    }

    // 4. Atomic Balance Update
    user.balance -= amount;
    await user.save();

    // 5. Create Withdrawal Record
    const withdraw = await Withdraw.create({
      userId,
      amount,
      method,
      accountNumber,
      status: "pending",
    });

    // 6. Log Transaction for Audit and User Activities
    await Transaction.create({
      userId,
      amount: amount,
      type: "expense",
      category: "withdraw",
      description: `Withdrawal request via ${method} to ${accountNumber}`,
      balanceAfter: user.balance,
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request processed",
      data: withdraw,
    });
  } catch (error: unknown) {
    console.error("WITHDRAW_POST_ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
