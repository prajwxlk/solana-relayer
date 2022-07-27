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
  const { access } = req.body;

  const x = await prisma.keys.findFirst({
    where: {
      access,
    },
  });

  if (!x) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }
  console.log(x);

  const user = await prisma.user.findFirst({
    where: {
      id: x.owner,
    },
  });
  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
  }


  res.json({
    success: true,
    publicKey: user?.publicKey,
  });
}
