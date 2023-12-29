export interface UserData {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar?: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled: boolean;
  banner?: string;
  accent_color?: number;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
  avatar_decoration?: string;
}

export interface TeamMember {
  membership_state: number;
  team_id: string;
  user: UserData;
  role: string;
}

export interface TeamData {
  icon?: string;
  id: string;
  members: Array<TeamMember>;
  name: string;
  owner_user_id: string;
}

export interface ApplicationData {
  id?: string;
  name?: string;
  icon?: string;
  description?: string;
  rpc_origins?: Array<string>;
  bot_public?: boolean;
  bot_require_code_grant?: boolean;
  bot?: UserData;
  terms_of_service_url?: string;
  privacy_policy_url?: string;
  owner?: UserData;
  verify_key?: string;
  team?: TeamData;
  guild_id?: string;
  // skipped guild object
  primary_sku_id?: string;
  slug?: string;
  cover_image?: string;
  flags?: number;
  approximate_guild_count?: number;
  redirect_uris?: Array<string>;
  interactions_endpoint_url?: string;
  role_connections_verification_url?: string;
  tags?: Array<string>;
  // skipped install params
  custom_install_url?: string;
}
