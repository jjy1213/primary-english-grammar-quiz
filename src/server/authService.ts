import { readJsonFile } from "./fsUtils.js";
import { paths } from "./config.js";
import type { LoginResponse, UserAccount } from "./types.js";
import { userAccountListSchema } from "./validation.js";

function loadUsers(): UserAccount[] {
  const parsed = userAccountListSchema.safeParse(readJsonFile(paths.users));
  if (!parsed.success) {
    throw new Error(`User data is invalid: ${parsed.error.message}`);
  }

  return parsed.data;
}

export function login(input: { username: string; password: string }): LoginResponse {
  const matchedUser = loadUsers().find(
    (item) => item.username === input.username && item.password === input.password
  );

  if (!matchedUser) {
    throw new Error("Invalid username or password.");
  }

  return {
    user: {
      id: matchedUser.id,
      username: matchedUser.username,
      displayName: matchedUser.displayName
    }
  };
}
