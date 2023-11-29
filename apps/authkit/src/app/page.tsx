import { WorkOS } from "@workos-inc/node";

const workos = new WorkOS(process.env.WORKOS_API_KEY);

export default function Basic({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const authKitUrl = workos.userManagement.getAuthorizationUrl({
    clientId: process.env.WORKOS_CLIENT_ID || "",
    provider: "authkit",
    redirectUri: "http://localhost:3000/callback",
  });

  const result = JSON.parse(
    String(searchParams.response ?? '{ "error": null }')
  );

  return (
    <div>
      <a href={authKitUrl}>Sign-in with AuthKit</a>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
