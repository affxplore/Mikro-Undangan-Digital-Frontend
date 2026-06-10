export function fromBackend(receiveInv = {}) {
  return {
    id: receiveInv.id ?? null,
    invitationId:
      receiveInv.invitation_id ?? receiveInv.invitation?.id ?? null,
    invitation: receiveInv.invitation
      ? {
          id: receiveInv.invitation.id,
          name: receiveInv.invitation.name,
        }
      : null,
    recipient: receiveInv.recipient ?? "",
    phoneNumber: receiveInv.phone_number ?? "",
    email: receiveInv.email ?? "",
    code: receiveInv.code ?? "",
    status: receiveInv.status,
    createdAt: receiveInv.createdAt ?? receiveInv.created_at ?? null,
    updatedAt: receiveInv.updatedAt ?? receiveInv.updated_at ?? null,
  };
}

export function toBackend(receiveInv = {}) {
  const payload = {
    invitation_id:
      receiveInv.invitationId ?? receiveInv.invitation_id ?? undefined,
    recipient: receiveInv.recipient,
    phone_number: receiveInv.phoneNumber ?? receiveInv.phone_number,
    email: receiveInv.email,
    status: receiveInv.status,
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}


