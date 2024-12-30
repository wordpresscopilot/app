import { joinWaitlist } from "@/app/actions/join-waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

interface JoinWaitlistFormProps {
  className?: string;
}

export const JoinWaitlistForm = forwardRef<
  HTMLFormElement,
  JoinWaitlistFormProps
>(({ className }, ref) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    const result = await joinWaitlist(formData);
    if (result.success) {
      toast.success("Successfully joined waitlist");
      reset();
    } else {
      console.error("Error joining waitlist:", result.error);
      toast.error(result.error || "An unexpected error occurred");
    }
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "flex flex-col sm:flex-row gap-2.5 items-start justify-center mt-2 lg:min-w-[600px]",
        className
      )}
    >
      <div className="flex-grow w-full">
        <Input
          type="email"
          placeholder="Enter your email"
          className="bg-gray-100 text-black placeholder:text-gray-500"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <Button type="submit" className="w-fit text-lg font-semibold">
        Join the Mailing List
      </Button>
    </form>
  );
});

JoinWaitlistForm.displayName = "JoinWaitlistForm";
