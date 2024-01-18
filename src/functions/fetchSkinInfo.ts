type APIResponse = {
  success: boolean;
  error?: string;
};

export async function fetchSkinInfo(
  nickOrUIID: string
): Promise<APIResponse> {
  if (typeof nickOrUIID !== "string") {
    throw new Error(
      `The nickOrUIID parameter expected the string type but received ${typeof nickOrUIID}`
    );
  }
  const url = process.env.BASE_SKIN_INFO_URL + `/${nickOrUIID}`;

  const response = await fetch(url);
  const data = (await response.json()) as APIResponse;

  if (data.error) {
    return {
      success: false,
      error: data.error
    }
  }

  return {
    success: true,
    ...data
  }
}
