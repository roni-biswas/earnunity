import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Withdraw } from "@/models/Withdraw";
import { User } from "@/models/User";
import { Transaction } from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = await params;
    const session = await getServerSession(authOptions);

    // 1. Admin Authorization Check
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    const { status } = await req.json(); // Expected: "completed" or "rejected"
    const withdrawId = id;

    // 2. Find the withdrawal request
    const withdrawReq = await Withdraw.findById(withdrawId);
    if (!withdrawReq) {
      return NextResponse.json(
        { success: false, message: "Request not found" },
        { status: 404 },
      );
    }

    // 3. Prevent updating if already processed
    if (withdrawReq.status !== "pending") {
      return NextResponse.json(
        { success: false, message: "Already processed" },
        { status: 400 },
      );
    }

    // 4. Handle Rejection (Refund Logic)
    if (status === "rejected") {
      const user = await User.findById(withdrawReq.userId);
      if (user) {
        user.balance += withdrawReq.amount; // Refund the amount
        await user.save();

        // Create a transaction record for the refund
        await Transaction.create({
          userId: user._id,
          amount: withdrawReq.amount,
          type: "income",
          category: "bonus",
          description: `Refund for rejected withdraw request (#${withdrawId.slice(-6)})`,
          balanceAfter: user.balance,
        });
      }
    }

    // 5. Update Withdrawal Status
    withdrawReq.status = status;
    withdrawReq.statusUpdateDate = new Date(); // Optional: track when it was updated
    await withdrawReq.save();

    return NextResponse.json({
      success: true,
      message: `Withdrawal ${status} successfully`,
    });
  } catch (error) {
    console.error("Admin Withdraw Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
