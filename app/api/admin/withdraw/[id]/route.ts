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

    // ===================================================================
    // 6. NEW: Trigger Live Notification to the User (Approve/Reject)
    // ===================================================================
    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      // Determine dynamic visual markers and titles based on admin action
      const isApproved = status === "completed"; // Matching your frontend terminology
      const notifTitle = isApproved
        ? "Withdrawal Approved! 💰"
        : "Withdrawal Rejected! ❌";

      const notifMessage = isApproved
        ? `Great news! Your withdrawal request of ৳${withdrawReq.amount} via ${withdrawReq.method} has been approved.`
        : `Your withdrawal request of ৳${withdrawReq.amount} via ${withdrawReq.method} was rejected. The amount has been refunded to your wallet.`;

      /**
       * Making an internal REST request back to our global notification engine.
       * Target changes from ADMIN_ID directly to the unique user ID bound within the withdrawal record.
       */
      await fetch(`${siteUrl}/api/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: withdrawReq.userId.toString(), // Send notification directly to the specific user
          title: notifTitle,
          message: notifMessage,
          type: "system",
          path: "/dashboard/withdraw", // Redirects user smoothly to their withdraw panel context
        }),
      });
    } catch (notifErr) {
      console.error(
        "Failed to route withdrawal status update notification to user:",
        notifErr,
      );
    }

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
