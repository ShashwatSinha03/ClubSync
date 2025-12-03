import prisma from "../lib/prisma.js";

// GET all members (admin only)
export const getAllMembers = async (req, res, next) => {
  try {
    const members = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        approved: true,
        createdAt: true,
      },
    });

    return res.json({ members });
  } catch (err) {
    next(err);
  }
};

// APPROVE a member
export const approveMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await prisma.user.update({
      where: { id },
      data: { approved: true },
    });

    return res.json({
      message: "Member approved successfully",
      member: {
        id: member.id,
        email: member.email,
        approved: member.approved,
      },
    });
  } catch (err) {
    next(err);
  }
};

// DELETE a member
export const deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    return res.json({ message: "Member removed successfully" });
  } catch (err) {
    next(err);
  }
};
