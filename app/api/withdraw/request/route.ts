import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Withdraw } from "@/models/Withdraw";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { WithdrawZodSchema } from "@/lib/validations/withdraw";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    // 1. Validate incoming data using Zod
    const validatedData = WithdrawZodSchema.parse({
      ...body,
      userId: session.user.id,
    });

    // 2. Check User Balance
    const user = await User.findById(session.user.id);
    if (!user || user.balance < validatedData.amount) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 },
      );
    }

    // 3. Create Withdraw Request
    const newWithdraw = await Withdraw.create(validatedData);

    // 4. Deduct Balance from User
    user.balance -= validatedData.amount;
    await user.save();

    // 5. Create a Transaction entry for history
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
