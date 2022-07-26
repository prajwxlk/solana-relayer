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
  const { sessionId, password } = req.body;

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

  const masterKey = CryptoJS.AES.decrypt(user.masterKey, password).toString(
    CryptoJS.enc.Utf8
  );

  const accessKey = uuidv4();
  const accessSecret = uuidv4();

  await prisma.keys.create({
    data: {
      access: accessKey,
      secret: CryptoJS.AES.encrypt(masterKey, accessSecret).toString(),
      owner: user.id,
    },
  });

  res.status(200).json({
    success: true,
    accessKey,
    accessSecret,
  });
}
