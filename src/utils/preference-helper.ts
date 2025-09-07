import { Preferences } from "@capacitor/preferences";

export const setData = async (key: string, value: string) => {
  await Preferences.set({
    key,
    value,
  });
};

export const getData = async (key: string) => {
  const { value } = await Preferences.get({ key });
  return value;
};

export const removeData = async (key: string) => {
  await Preferences.remove({ key });
};
