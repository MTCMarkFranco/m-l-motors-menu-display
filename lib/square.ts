import { SquareClient, SquareEnvironment } from "square";

let client: SquareClient | null = null;

export function getSquareClient(): SquareClient {
  if (!client) {
    const token = process.env.SQUARE_ACCESS_TOKEN;
    if (!token || token === "YOUR_SQUARE_ACCESS_TOKEN_HERE") {
      throw new Error("SQUARE_ACCESS_TOKEN is not configured");
    }

    client = new SquareClient({
      token,
      environment:
        process.env.SQUARE_ENVIRONMENT === "production"
          ? SquareEnvironment.Production
          : SquareEnvironment.Sandbox,
    });
  }
  return client;
}
