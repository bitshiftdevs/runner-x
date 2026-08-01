import { NextResponse } from "next/server";

import { gqlRequest } from "@/lib/gql-client";
import type { BackendError } from "@/lib/gql-errors";
import {
  type BackendPaymentMethod,
  toClientPaymentMethod,
} from "@/lib/graphql/adapters";
import {
  ADD_PAYMENT_METHOD,
  MY_PAYMENT_METHODS,
} from "@/lib/graphql/operations";

export async function GET() {
  try {
    const data = await gqlRequest<{ myPaymentMethods: BackendPaymentMethod[] }>(
      MY_PAYMENT_METHODS,
    );
    return NextResponse.json({
      methods: data.myPaymentMethods.map(toClientPaymentMethod),
    });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { methods: [], error: be.message },
      { status: be.kind === "unauthenticated" ? 401 : 500 },
    );
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    channel?: string;
    phoneNumber?: string;
    accountName?: string;
  };
  if (!body.channel || !body.phoneNumber) {
    return NextResponse.json(
      { error: "channel and phoneNumber are required" },
      { status: 400 },
    );
  }
  try {
    const data = await gqlRequest<{ addPaymentMethod: BackendPaymentMethod }>(
      ADD_PAYMENT_METHOD,
      {
        channel: body.channel,
        phoneNumber: body.phoneNumber,
        accountName: body.accountName ?? null,
      },
    );
    return NextResponse.json({
      method: toClientPaymentMethod(data.addPaymentMethod),
    });
  } catch (err) {
    const be = err as BackendError;
    return NextResponse.json(
      { error: be.message },
      { status: be.kind === "unauthenticated" ? 401 : 400 },
    );
  }
}
