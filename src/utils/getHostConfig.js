export const getHostConfig = () => {
  const currentHost = window.location.hostname;
  console.log(currentHost, "......currentHost");
  if (currentHost === "localhost") {
    return {
      subdomain: "ev",
      env: "dev",
      baseDomain: "evueme.dev",
      authHost: "ev-auth.evueme.dev",
      apiHost: "ev-api.evueme.dev",
      AUTH_API_BASE_URL: "https://ev-auth.evueme.dev",
      API_BASE_URL: "https://ev-api.evueme.dev",
    };
  }

  const parts = currentHost.split(".");

  const subdomain = parts[0] || "app";

  let env = "dev";
  if (parts.includes("live")) env = "live";
  if (parts.includes("ai")) env = "ai";

  const baseDomain = `evueme.${env}`;
  const authHost = `${subdomain}-auth.${baseDomain}`;
  const apiHost = `${subdomain}-api.${baseDomain}`;

  const AUTH_API_BASE_URL = `https://${authHost}`;
  const API_BASE_URL = `https://${apiHost}`;

  return {
    subdomain,
    env,
    baseDomain,
    authHost,
    apiHost,
    AUTH_API_BASE_URL,
    API_BASE_URL,
  };
};
