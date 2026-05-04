// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initAdminAccount } = await import("./actions/auth");
    await initAdminAccount();
  }
}