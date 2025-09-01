import pool from "../config/db";
import * as commonQueries from "../app/common/queries";

type roleTarget = "admin" | "teacher" | "student";

interface notification {
  schoolId: number;
  userId?: number;
  roleTarget?: roleTarget;
  title: string;
  message: string;
  type: string;
  file_url?: string;
  metadata?: {};
}

export const createNotification = async ({
  schoolId,
  userId,
  roleTarget,
  title,
  message,
  type,
  file_url,
  metadata,
}: notification) => {
  try {
    const result = await pool.query(commonQueries.CREATE_NOTIFICATION, [
      schoolId,
      userId || null,
      roleTarget || null,
      title,
      message,
      file_url || null,
      metadata || {},
      type,
    ]);
    if (!result) console.log("Failed to create notification");

    return result.rows[0].id;
  } catch (error) {
    console.log("Create notification error:", error);
  }
};

export const createSingleReceipt = async (
  notificationId: number,
  userId: number
) => {
  try {
    const result = await pool.query(
      commonQueries.CREATE_SINGLE_NOTIFICATION_RECEIPT,
      [notificationId, userId]
    );
    if (!result) console.log("Failed to create notification receipt");
    return;
  } catch (error) {
    console.log("Create notification receipt error:", error);
  }
};
