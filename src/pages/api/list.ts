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
  const { sessionId } = req.body;

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

  const keysOwned = await prisma.keys.findMany({
    where: {
      owner: user.id,
    },
  });

  res.json({
    success: true,
    publicKey: user.publicKey,
    keys: keysOwned.map((key) => key.access),
  });
}
