import createClient from "openapi-fetch";
import type { paths } from './api.generated';

export default createClient<paths>({ baseUrl: import.meta.env.API_BASE_URL ?? '/api/v1' });