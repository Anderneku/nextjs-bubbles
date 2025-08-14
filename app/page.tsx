import { Check, XIcon } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="w-screen h-screen flex flex-col ">
        <div className="flex w-full h-fit p-4 gap-4">
          <h1 className="text-4xl text-foreground">Bubbles |</h1>
        </div>
        <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
          <div className="flex flex-col items-center">
            <h1 className="text-7xl text-center text-shadow-lg text-shadow-secondary-foreground">
              Social Media Without All the{" "}
            </h1>
            <h1 className="text-7xl text-center text-shadow-secondary-foreground bg-destructive w-fit text-secondary-foreground rounded-lg text-shadow-none">
              Noise
            </h1>

            <h1 className="text-3xl text-center text-muted-foreground">
              Build the Social Network that's Just for You
            </h1>
          </div>
          <div className="flex w-full items-center justify-center gap-8 ">
            <div className="flex flex-col items-center">
              <img
                src={"/images/bubblelogoMute.svg"}
                className="shadow-lg z-50 self-center rounded-full"
                width={100}
                height={100}
              />
              <XIcon color="var(--destructive)" className="size-16" />
            </div>
            <div className="flex flex-col items-center">
              <img
                src={"/images/bubblelogoPrim.svg"}
                className="shadow-lg z-50 self-center rounded-full"
                width={200}
                height={200}
              />
              <Check color="var(--accent-foreground)" className="size-16" />
            </div>
            <div className="flex flex-col items-center">
              <img
                src={"/images/bubblelogoMute.svg"}
                className="shadow-lg z-50 self-center rounded-full"
                width={100}
                height={100}
              />
              <XIcon color="var(--destructive)" className="size-16" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
