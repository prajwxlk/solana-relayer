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
  const { email, password } = req.body;
  const sessionId = uuidv4();
  const keyPair = Keypair.generate();

  await prisma.user.create({
    data: {
      email,
      masterKey: CryptoJS.AES.encrypt(
        keyPair.secretKey.toString(),
        password
      ).toString(),
      password: cryptPassword(password),
      sessionId,
      publicKey: keyPair.publicKey.toString(),
    },
  });
  res.status(200).json({
    success: true,
    sessionId,
    publicKey: keyPair.publicKey.toString(),
  });
}
