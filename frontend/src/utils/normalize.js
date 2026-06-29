export function toArray(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.docs)) return result.docs;
  if (Array.isArray(result?.data)) return result.data;
  return [];
}

export function getId(item) {
  return item?._id || item?.id;
}

export function getClientLabel(client) {
  if (!client) return 'Unknown client';
  return client.company ? `${client.name} • ${client.company}` : client.name;
}
