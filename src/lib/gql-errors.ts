import type { ClientError } from "graphql-request";

/**
 * Backend error taxonomy. Kept in one place so callers can `switch` on it
 * instead of duplicating string checks.
 *
 * See docs/MIGRATION_PLAN.md → "Contract summary → Errors" for the source
 * of truth on the wire shape.
 */
export type BackendErrorKind =
  | "not_found"
  | "permission_denied"
  | "unauthenticated"
  | "bad_request"
  | "validation"
  | "internal"
  | "network";

export type ValidationDetail = {
  constraint: string;
  path: string[];
  message: string;
};

export type BackendError = {
  kind: BackendErrorKind;
  message: string;
  /** Populated only when `kind === "validation"`. */
  validation?: ValidationDetail[];
};

type GraphQLErrorLike = {
  message: string;
  extensions?: Record<string, unknown>;
  path?: readonly (string | number)[];
};

const errorTypeToKind: Record<string, BackendErrorKind> = {
  NOT_FOUND: "not_found",
  PERMISSION_DENIED: "permission_denied",
  UNAUTHENTICATED: "unauthenticated",
  BAD_REQUEST: "bad_request",
  INTERNAL_ERROR: "internal",
};

function classifyGraphQLError(err: GraphQLErrorLike): BackendError {
  const ext = err.extensions ?? {};

  // Extended-validation errors: extensions.classification is an object.
  const classification = ext.classification;
  if (
    classification &&
    typeof classification === "object" &&
    (classification as { type?: string }).type === "ExtendedValidationError"
  ) {
    const c = classification as {
      type: string;
      constraint?: string;
      validatedPath?: (string | number)[];
    };
    return {
      kind: "validation",
      message: err.message,
      validation: [
        {
          constraint: c.constraint ?? "unknown",
          path: (c.validatedPath ?? []).map(String),
          message: err.message,
        },
      ],
    };
  }

  // Domain errors: extensions.errorType is a string enum.
  const errorType =
    typeof ext.errorType === "string" ? ext.errorType : undefined;
  if (errorType && errorTypeToKind[errorType]) {
    return { kind: errorTypeToKind[errorType], message: err.message };
  }

  return { kind: "internal", message: err.message };
}

/**
 * Turns anything thrown by graphql-request (or a network failure) into a
 * typed {@link BackendError}. Merges multiple validation errors into a single
 * one so callers can render a form-error map without extra plumbing.
 */
export function toBackendError(err: unknown): BackendError {
  if (err && typeof err === "object" && "response" in err) {
    const clientErr = err as ClientError;
    const errors = clientErr.response?.errors ?? [];
    if (errors.length === 0) {
      return { kind: "internal", message: clientErr.message };
    }
    const classified = errors.map((e) =>
      classifyGraphQLError(e as GraphQLErrorLike),
    );
    const validation = classified.flatMap((c) => c.validation ?? []);
    if (validation.length > 0) {
      return {
        kind: "validation",
        message: classified[0].message,
        validation,
      };
    }
    // Non-validation: take the strongest signal (first non-internal, else first).
    return classified.find((c) => c.kind !== "internal") ?? classified[0];
  }

  if (err instanceof Error) {
    return { kind: "network", message: err.message };
  }

  return { kind: "network", message: "Unknown error" };
}

/** True when a domain layer should redirect the user to sign in again. */
export function isUnauthenticated(err: BackendError): boolean {
  return err.kind === "unauthenticated";
}
