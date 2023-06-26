import { signIn } from "next-auth/react";
import { Modal } from "../Modal/Modal";
import { Button } from "../Button/Button";
import { useForm } from "react-hook-form";
import Image from "next/image";

type EmailForm = {
  email: string;
};

const LoginModal = ({ onClose }: { onClose: () => void }) => {
  const {
    getValues,
    register,
    formState: { errors },
  } = useForm<EmailForm>();

  const emailSign = async () => {
    const email = getValues("email");
    await signIn("email", { email });
  };

  return (
    <div className="flex h-full w-full justify-center">
      <Modal onClose={onClose}>
        <div className="flex h-full w-full flex-1 flex-col items-center gap-4 px-12 py-4">
          <h1 className="cursor-pointer text-left font-lobster text-2xl text-influencer lg:text-4xl">
            Influencer Markt
          </h1>

          <form className="flex w-full flex-col gap-4">
            <input
              {...register("email")}
              type="text"
              className="h-14 rounded-lg border-[1px] border-gray3 p-4 placeholder-gray2"
              placeholder="Email"
              autoComplete="off"
            />
            <Button
              title="Send secure link"
              level="primary"
              size="large"
              onClick={() => emailSign()}
            />
          </form>
          <div className="flex w-full flex-1 items-center gap-6">
            <div className="h-[1px] w-full border-[1px] border-gray3" />
            <div>or</div>
            <div className="h-[1px] w-full border-[1px] border-gray3" />
          </div>
          <button
            className="flex h-10 w-full flex-1 cursor-pointer items-center justify-center rounded-lg border-[1px] border-gray3 py-3 pr-6 text-center lg:rounded-2xl"
            onClick={() => signIn("google")}
          >
            <div className="py-2 pl-2 pr-6">
              <Image
                src={`/images/google.svg`}
                height={32}
                width={32}
                alt="google logo"
                className="object-contain"
              />
            </div>
            <div className="font-roboto font-medium ">Sign in with Google</div>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export { LoginModal };
