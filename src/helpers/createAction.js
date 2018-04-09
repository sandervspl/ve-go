export const createAction = type => (payload, meta) => ({
  type,
  payload,
  error: payload instanceof Error,
  meta,
});
