import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { cryptPassword, comparePassword } from "../../server/pass";
import { Keypair } from "@solana/web3.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  if (!comparePassword(password, user.password)) {
    res.status(404).json({
      success: false,
      message: "Password incorrect",
    });
    return;
  }

  const sessionId = uuidv4();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      sessionId,
    },
  });

  res.status(200).json({
    success: true,
    sessionId,
    publicKey: user.publicKey,
  });
}
