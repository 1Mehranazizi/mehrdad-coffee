import Kavenegar from "kavenegar";

export async function sendOtpSms(phone: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const api = Kavenegar.KavenegarApi({
      apikey: process.env.KAVENEGAR_API_KEY!,
    });

    api.VerifyLookup(
      {
        receptor: phone,
        token: code,
        template: "mehrdadcoffee",
      },
      (response, status) => {
        console.log("Kavenegar response:", response);
        console.log("Kavenegar status:", status);

        if (status === 200) {
          resolve();
          return;
        }

        reject(new Error(`Kavenegar OTP error: ${status}`));
      }
    );
  });
}
