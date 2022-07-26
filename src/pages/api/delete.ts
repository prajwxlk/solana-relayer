import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { cryptPassword } from "../../server/pass";
import { Keypair } from "@solana/web3.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { sessionId, key } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      sessionId,
    },
  });
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  const keyDoc = await prisma.keys.findFirst({
    where: {
      access: key,
    },
  });
  if (!keyDoc) {
    res.status(404).json({
      success: false,
      message: "Key not found",
    });
    return;
  }
  if (keyDoc.owner !== user.id) {
    res.status(404).json({
      success: false,
      message: "Key not found",
    });
    return;
  }

  await prisma.keys.delete({
    where: {
      id: keyDoc.id,
    },
  });

  res.status(200).json({
    success: true,
  });
}
