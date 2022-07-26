import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import { cryptPassword } from "../../server/pass";
import { Keypair } from "@solana/web3.js";
import signup from "./signup";
import login from "./login";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, password } = req.body;
  const sessionId = uuidv4();
  const keyPair = Keypair.generate();

  const test = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!test) {
    return await signup(req, res);
  }
  await login(req, res);
}
