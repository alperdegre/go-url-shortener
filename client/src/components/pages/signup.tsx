import { useContext, useEffect, useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { APIError, TokenResponse } from "@/lib/types";
import { BASE_URL } from "@/lib/utils";
import { motion } from "framer-motion";
import { AuthContext } from "../context/authContext";
import { Link, useNavigate } from "react-router-dom";

const signUpSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters long" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

function SignUp() {
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    const response = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errResponse: APIError = await response.json();
      setError(errResponse.error);
    } else {
      const tokenResp: TokenResponse = await response.json();
      login(tokenResp.token, tokenResp.userID, tokenResp.expiry);
      navigate("/dashboard");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">SIGN UP</h2>
      <motion.div
        key={error}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {error ? (
          <p className="text-sm tracking-wider text-destructive">{error}</p>
        ) : (
          <p className="text-sm tracking-wider">
            Create a new account to start shortening your URLs
          </p>
        )}
      </motion.div>
      <div className="p-4">
        <Form {...signUpForm}>
          <form
            onSubmit={signUpForm.handleSubmit(onSubmit)}
            className="space-y-3"
          >
            <FormField
              control={signUpForm.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-0 h-[81px]">
                  <FormLabel className="pb-1">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a username" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs pl-2 py-1" />
                </FormItem>
              )}
            />
            <FormField
              control={signUpForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-0 h-[81px]">
                  <FormLabel className="pb-1">Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a password" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs pl-2 py-1" />
                </FormItem>
              )}
            />
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button type="submit" variant={"default"}>
                  SIGN UP
                </Button>
                <p className="text-xs text-center">
                  Already have an account?{" "}
                  <Link
                    className="text-[#00ADD8] hover:underline"
                    to="/login"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default SignUp;
