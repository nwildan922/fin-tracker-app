import { Toast } from "@capacitor/toast";

export const showMessage = async (text: string) => {
  await Toast.show({
    text,
  });
};
