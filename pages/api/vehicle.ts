import {callChatGPT} from "./utils";
import type {NextApiRequest, NextApiResponse} from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<Record<string, string>>) {
  const carData = {
    "model": "CR-V",
    "make": "Honda",
    "year": "2004",
    "zipCode": ""
  }

  const data = await callChatGPT(`
    Given the following data: ${JSON.stringify(carData)}
    Attempt to give me the estimate height clearance in feet
    Please result with a number, not a caveat.
  `)

  return res.status(200).json({ data });
}