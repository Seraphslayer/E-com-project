/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Address of the API when it is not on the same domain as the site (leave empty normally). */
  readonly VITE_API_URL?: string;
  /** Where the admin "Back to site" link goes. Defaults to /store (the demo); use the shop's domain on AWS. */
  readonly VITE_STORE_URL?: string;
}
