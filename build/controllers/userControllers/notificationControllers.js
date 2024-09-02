"use strict";
// export const getNotifications = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId;
//     const notifications = await Notification.find({ user_id: userId })
//       .sort({ createdAt: -1 })
//       .populate("sender_id");
//     res.status(200).json({ notifications });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "notifications fetching failed" });
//   }
// };
// export const get_unread_notifications = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId;
//     const unreadnotifications = await Notification.find({
//       user_id: userId,
//       unread: true,
//     });
//     res.status(200).json({ unreadnotifications });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "unread notifications fetching failed" });
//   }
// };
// export const clear_unread_notifications = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const userId = req.userId;
//     await Notification.updateMany(
//       { user_id: userId },
//       { $set: { unread: false } }
//     );
//     res.status(200).json({ message: "Ok" });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "clearing failed" });
//   }
// };
